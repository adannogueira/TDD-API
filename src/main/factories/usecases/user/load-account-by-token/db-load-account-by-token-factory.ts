import { DbLoadAccountByToken } from '../../../../../data/usecases/load-account-by-token/db-load-account-by-token'
import { LoadAccountByToken } from '../../../../../domain/usecases/load-account-by-token'
import { JwtAdapter } from '../../../../../infra/criptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '../../../../../infra/db/mongodb/account/account-mongo-repository'
import env from '../../../../config/env'

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const secret = env.jwtSecret
  const expiresIn = env.jwtExpiration
  const jwtAdapter = new JwtAdapter(secret, expiresIn)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbLoadAccountByToken(jwtAdapter, accountMongoRepository)
}
