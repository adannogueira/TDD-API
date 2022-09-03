import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import env from '../config/env'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

let surveyCollection: Collection
let accountCollection: Collection

describe('Survey Routes', () => {
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
      const result = await accountCollection.insertOne({
        name: 'John Doe',
        email: 'john@mail.com',
        password: 'any_password',
        role: 'admin'
      })
      const id = result.insertedId.toString()
      const accessToken = sign({ id }, env.jwtSecret)
      await accountCollection.updateOne({
        _id: result.insertedId
      }, {
        $set: {
          accessToken
        }
      })
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
      const result = await accountCollection.insertOne({
        name: 'John Doe',
        email: 'john@mail.com',
        password: 'any_password',
        role: 'admin'
      })
      const id = result.insertedId.toString()
      const accessToken = sign({ id }, env.jwtSecret, { expiresIn: '0s' })
      await accountCollection.updateOne({
        _id: result.insertedId
      }, {
        $set: {
          accessToken
        }
      })
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
  })
})
