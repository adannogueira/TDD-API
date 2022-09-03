import { MongoHelper } from '@infra/db/mongodb/helpers/mongo-helper'
import app from '@main/config/app'
import env from '@main/config/env'
import { hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import request from 'supertest'

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
    })

    test('Should return 401 when access token is not expired', async () => {
      const tokens = await makeAuthenticatedUserTokens('1m', '1m')
      await request(app)
        .post('/api/refresh')
        .set('x-access-token', tokens.accessToken)
        .set('x-refresh-token', tokens.refreshToken)
        .send()
        .expect(401)
    })

    test('Should return 200 on success', async () => {
      const tokens = await makeAuthenticatedUserTokens('0s', '1m')
      const result = await request(app)
        .post('/api/refresh')
        .set('x-access-token', tokens.accessToken)
        .set('x-refresh-token', tokens.refreshToken)
        .send()
        .expect(200)
      expect(result.body.accessToken).toBeTruthy()
      expect(result.body.accessToken).not.toBe(tokens.accessToken)
      expect(result.body.refreshToken).toBeTruthy()
      expect(result.body.refreshToken).not.toBe(tokens.refreshToken)
    })
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
