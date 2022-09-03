import { AccountMongoRepository } from './account-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { Collection } from 'mongodb'

describe('Account Mongodb Repository', () => {
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

  describe('add()', () => {
    test('Should return an account on add success', async () => {
      const sut = makeSut()
      const account = await sut.add({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      })
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('any_password')
    })
  })

  describe('loadByEmail()', () => {
    test('Should return an account on load success', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      })
      const account = await sut.loadByEmail('any_email@mail.com')
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('any_password')
    })

    test('Should return null if loadByEmail fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByEmail('any_email@mail.com')
      expect(account).toBeFalsy()
    })
  })

  describe('updateAccessToken()', () => {
    test('Should update the account accessToken on updateAccessToken success', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      })
      const result = await sut.loadByEmail('any_email@mail.com')
      // eslint-disable-next-line @typescript-eslint/dot-notation
      expect(result['accessToken']).toBeFalsy()
      await sut.updateAccessToken(result.id, 'any_token')
      const account = await accountCollection.findOne({ name: 'any_name' })

      expect(account).toBeTruthy()
      expect(account?.accessToken).toBe('any_token')
    })
  })

  describe('loadByAccessToken()', () => {
    test('Should return an account on loadByAccessToken without role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        accessToken: 'any_token'
      })
      const account = await sut.loadByAccessToken('any_token')
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('any_password')
    })

    test('Should return an account on loadByAccessToken with admin role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        accessToken: 'any_token',
        role: 'admin'
      })
      const account = await sut.loadByAccessToken('any_token', 'admin')
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('any_password')
    })

    test('Should return null on loadByAccessToken with invalid role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        accessToken: 'any_token'
      })
      const account = await sut.loadByAccessToken('any_token', 'admin')
      expect(account).toBeFalsy()
    })

    test('Should return an account on loadByAccessToken if user is admin', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        accessToken: 'any_token',
        role: 'admin'
      })
      const account = await sut.loadByAccessToken('any_token')
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('any_password')
    })

    test('Should return null if loadByAccessToken fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByAccessToken('any_email@mail.com')
      expect(account).toBeFalsy()
    })
  })

  describe('updateRefreshToken()', () => {
    test('Should update the account refreshToken on updateRefreshToken success', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      })
      const result = await sut.loadByEmail('any_email@mail.com')
      // eslint-disable-next-line @typescript-eslint/dot-notation
      expect(result['tokenId']).toBeFalsy()
      await sut.updateRefreshToken(result.id, 'any_token_id')
      const account = await accountCollection.findOne({ name: 'any_name' })

      expect(account).toBeTruthy()
      expect(account?.tokenId).toBe('any_token_id')
    })
  })

  describe('loadByRefreshToken()', () => {
    test('Should return null if loadByRefreshToken fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByRefreshTokenId('any_email@mail.com')
      expect(account).toBeFalsy()
    })

    test('Should return an account on loadByRefreshToken success', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        tokenId: 'any_token_id'
      })
      const account = await sut.loadByRefreshTokenId('any_token_id')
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('any_password')
    })
  })
})

let accountCollection: Collection
const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}
