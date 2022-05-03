import { hash } from 'bcrypt'
import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/account/helpers/mongo-helper'
import app from '../config/app'

let accountCollection: Collection
describe('Account Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('[POST] /signup', () => {
    test('Should return 200 on signup success', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'John Doe',
          email: 'john@gmail.com',
          password: '123456',
          passwordConfirmation: '123456'
        })
        .expect(200)
    })
  })

  describe('[POST] /login', () => {
    test('Should return 200 on login success', async () => {
      const password = await hash('123456', 12)
      await accountCollection.insertOne({
        name: 'John Doe',
        email: 'john@gmail.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'john@gmail.com',
          password: '123456'
        })
        .expect(200)
    })

    test('Should return 401 on login when user does not exist', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'john@gmail.com',
          password: '123456'
        })
        .expect(401)
    })
  })
})
