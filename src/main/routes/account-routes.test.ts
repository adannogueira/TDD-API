import { hash } from 'bcrypt'
import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import { sign } from 'jsonwebtoken'
import env from '../config/env'

let accountCollection: Collection
describe('Account Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL!)
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

  describe('[POST] /refresh', () => {
    test('Should return 401 when refresh token does not exist', async () => {
      await request(app)
        .post('/api/refresh')
        .set('x-access-token', 'accessToken')
        .send()
        .expect(401)
    })

    test('Should return 401 when access token does not exist', async () => {
      await request(app)
        .post('/api/refresh')
        .set('x-refresh-token', 'refreshToken')
        .send()
        .expect(401)
    })

    test('Should return 401 when refresh token is expired', async () => {
      const tokens = await makeAuthenticatedUserTokens('0s', '0s')
      await request(app)
        .post('/api/refresh')
        .set('x-access-token', tokens.accessToken)
        .set('x-refresh-token', tokens.refreshToken)
        .send()
        .expect(401)
    }, 20000)
  })
})

const makeAuthenticatedUserTokens = async (
  accessTime: string,
  refreshTime: string
): Promise<{ accessToken: string, refreshToken: string }> => {
  const result = await accountCollection.insertOne({
    name: 'John Doe',
    email: 'john@mail.com',
    password: 'any_password',
    role: 'admin'
  })
  const id = result.insertedId.toString()
  const accessToken = sign(
    { id },
    env.jwtSecret,
    { expiresIn: accessTime }
  )
  const refreshToken = sign(
    { id },
    env.jwtSecret,
    { jwtid: 'any_hash', expiresIn: refreshTime }
  )
  await accountCollection.updateOne({
    _id: result.insertedId
  }, {
    $set: {
      accessToken,
      tokenId: 'any_hash'
    }
  })
  return { accessToken, refreshToken }
}
