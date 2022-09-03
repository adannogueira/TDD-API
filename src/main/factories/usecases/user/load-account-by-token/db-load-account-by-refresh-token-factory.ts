import { DbLoadAccountByRefreshToken } from '../../../../../data/usecases/load-account-by-token/db-load-account-by-refresh-token'
import { LoadAccountByRefreshToken } from '../../../../../domain/usecases/load-account-by-refresh-token'
import { JwtAdapter } from '@infra/criptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '@infra/db/mongodb/account/account-mongo-repository'
import env from '../../../../config/env'

export const makeDbLoadAccountByRefreshToken = (): LoadAccountByRefreshToken => {
  const jwtAdapter = new JwtAdapter(
    env.jwtSecret,
    env.accessTokenExpiration,
    env.refreshTokenExpiration
  )
  const accountMongoRepository = new AccountMongoRepository()
  return new DbLoadAccountByRefreshToken(
    jwtAdapter,
    accountMongoRepository
  )
}
