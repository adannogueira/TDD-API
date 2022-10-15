import { AddAccountRepository } from '$/data/protocols/db/account/add-account-repository'
import { LoadAccountByAccessTokenRepository } from '$/data/protocols/db/account/load-account-by-access-token-repository'
import { LoadAccountByEmailRepository } from '$/data/protocols/db/account/load-account-by-email-repository'
import { LoadAccountByRefreshTokenIdRepository } from '$/data/protocols/db/account/load-account-by-refresh-token-id-repository'
import { UpdateAccessTokenRepository } from '$/data/protocols/db/account/update-access-token-repository'
import { AccountModel, UpdateRefreshTokenRepository } from '$/data/usecases/authentication/db-authentication-protocols'
import { MongoHelper } from '../helpers/mongo-helper'
import { ObjectId } from 'mongodb'

export class AccountMongoRepository implements
  AddAccountRepository,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
  LoadAccountByAccessTokenRepository,
  UpdateRefreshTokenRepository,
  LoadAccountByRefreshTokenIdRepository {
  async add (accountData: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    const account = await accountCollection.findOne(result.insertedId)
    return Boolean(account)
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ email })
    return account && MongoHelper.map<AccountModel>(account)
  }

  async updateAccessToken (id: string, token: string): Promise<any> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne({
      _id: new ObjectId(id)
    }, {
      $set: { accessToken: token }
    })
  }

  async loadByAccessToken (token: string, role?: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({
      accessToken: token,
      $or: [{ role }, { role: 'admin' }]
    })
    return account && MongoHelper.map<AccountModel>(account)
  }

  async updateRefreshToken (id: string, tokenId: string): Promise<any> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne({
      _id: new ObjectId(id)
    }, { $set: { tokenId } })
  }

  async loadByRefreshTokenId (tokenId: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({
      tokenId
    })
    return account && MongoHelper.map<AccountModel>(account)
  }
}
