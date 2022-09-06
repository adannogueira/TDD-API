import { MongoHelper } from '$/infra/db/mongodb/helpers/mongo-helper'
import app from '$/main/config/app'
import env from '$/main/config/env'
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import request from 'supertest'

let surveyCollection: Collection
let accountCollection: Collection

describe('Survey Result Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL!)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await surveyCollection.deleteMany({})
  })
  describe('[PUT] /surveys/:surveyId/results', () => {
    test('Should return 403 when user is not authorized', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({
          answer: 'any_answer'
        })
        .expect(403)
    })

    test('Should return 200 on save survey result when user is authorized', async () => {
      const accessToken = await makeUserToken()
      const surveyId = await makeSurveyId()
      await request(app)
        .put(`/api/surveys/${surveyId}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'Answer 1'
        })
        .expect(200)
    })

    test('Should return 403 when token is expired', async () => {
      const accessToken = await makeUserToken({ admin: true, expired: true })
      const surveyId = await makeSurveyId()
      await request(app)
        .put(`/api/surveys/${surveyId}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'Answer 1'
        })
        .expect(403)
    })
  })
})

const makeUserToken = async (
  { admin, expired }: { admin?: boolean, expired?: boolean } = {}
): Promise<string> => {
  const user = await accountCollection.insertOne({
    name: 'John Doe',
    email: 'john@mail.com',
    password: 'any_password',
    role: admin ? 'admin' : undefined
  })
  const id = user.insertedId.toString()
  const accessToken = sign(
    { id },
    env.jwtSecret,
    { expiresIn: expired ? '0s' : '5m' }
  )
  await accountCollection.updateOne({
    _id: user.insertedId
  }, {
    $set: {
      accessToken
    }
  })
  return accessToken
}

const makeSurveyId = async (): Promise<string> => {
  const survey = await surveyCollection.insertOne({
    question: 'Question',
    answers: [{
      answer: 'Answer 1',
      image: 'http://image-name.com'
    }, {
      answer: 'Answer 2'
    }],
    date: new Date()
  })
  return survey.insertedId.toString()
}
