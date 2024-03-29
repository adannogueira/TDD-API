import { AddAccountRepository } from '$/data/protocols/db/account/add-account-repository'
import { LoadAccountByAccessTokenRepository } from '$/data/protocols/db/account/load-account-by-access-token-repository'
import { LoadAccountByEmailRepository } from '$/data/protocols/db/account/load-account-by-email-repository'
import { LoadAccountByRefreshTokenIdRepository } from '$/data/protocols/db/account/load-account-by-refresh-token-id-repository'
import { UpdateAccessTokenRepository } from '$/data/protocols/db/account/update-access-token-repository'
import { UpdateRefreshTokenRepository } from '$/data/usecases/authentication/db-authentication-protocols'
import { MongoHelper } from '../helpers/mongo-helper'
import { ObjectId } from 'mongodb'
import { CheckAccountByEmailRepository } from '../../../../data/protocols/db/account/check-account-by-email-repository'

export class AccountMongoRepository implements
  AddAccountRepository,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
  LoadAccountByAccessTokenRepository,
  UpdateRefreshTokenRepository,
  LoadAccountByRefreshTokenIdRepository,
  CheckAccountByEmailRepository {
  async add (accountData: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    const account = await accountCollection.findOne(result.insertedId)
    return Boolean(account)
  }

  async loadByEmail (email: string): Promise<LoadAccountByEmailRepository.Result> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({
      email
    }, {
      projection: {
        _id: 1,
        name: 1,
        password: 1
      }
    })
    return account && MongoHelper.map<LoadAccountByEmailRepository.Result>(account)
  }

  async updateAccessToken (id: string, token: string): Promise<any> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne({
      _id: new ObjectId(id)
    }, {
      $set: { accessToken: token }
    })
  }

  async loadByAccessToken (
    { accessToken, role }: LoadAccountByAccessTokenRepository.Params
  ): Promise<LoadAccountByAccessTokenRepository.Result> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({
      accessToken,
      $or: [{ role }, { role: 'admin' }]
    })
    return account && MongoHelper.map<LoadAccountByAccessTokenRepository.Result>(account)
  }

  async updateRefreshToken (id: string, tokenId: string): Promise<any> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne({
      _id: new ObjectId(id)
    }, { $set: { tokenId } })
  }

  async loadByRefreshTokenId (tokenId: string): Promise<LoadAccountByRefreshTokenIdRepository.Result> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({
      tokenId
    })
    return account && MongoHelper.map<LoadAccountByRefreshTokenIdRepository.Result>(account)
  }

  async checkByEmail (email: string): Promise<CheckAccountByEmailRepository.Result> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({
      email
    }, {
      projection: {
        _id: 1
      }
    })
    return Boolean(account)
  }
}
