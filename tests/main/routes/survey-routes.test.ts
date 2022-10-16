import { MongoHelper } from '$/infra/db/mongodb/helpers/mongo-helper'
import env from '$/main/config/env'
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import request from 'supertest'
import { setupApp } from '$/main/config/app'
import { Express } from 'express'

let app: Express
let surveyCollection: Collection
let accountCollection: Collection

describe('Survey Routes', () => {
  beforeAll(async () => {
    app = await setupApp()
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

  describe('[POST] /surveys', () => {
    test('Should return 403 when user is not authorized', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'Question',
          answers: [{
            answer: 'Answer 1',
            image: 'http://image-name.com'
          }, {
            answer: 'Answer 2'
          }]
        })
        .expect(403)
    })

    test('Should return 204 when user is authorized', async () => {
      const accessToken = await makeUserToken({ admin: true })
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'Question',
          answers: [{
            answer: 'Answer 1',
            image: 'http://image-name.com'
          }, {
            answer: 'Answer 2'
          }]
        })
        .expect(204)
    })

    test('Should return 403 when token is expired', async () => {
      const accessToken = await makeUserToken({ admin: true, expired: true })
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'Question',
          answers: [{
            answer: 'Answer 1',
            image: 'http://image-name.com'
          }, {
            answer: 'Answer 2'
          }]
        })
        .expect(403)
    })
  })

  describe('GET /surveys', () => {
    test('Should return 403 when user is not authorized', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(403)
    })

    test('Should return 204 when user is authorized and no survey exists', async () => {
      const accessToken = await makeUserToken()
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(204)
    })

    test('Should return 200 when user is authorized and surveys exists', async () => {
      const accessToken = await makeUserToken()
      await surveyCollection.insertMany([{
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        }],
        date: new Date()
      }])
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(200)
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
