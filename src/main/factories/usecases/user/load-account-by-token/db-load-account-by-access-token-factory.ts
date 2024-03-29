import { DbLoadAccountByAccessToken } from '$/data/usecases/account/load-account-by-access-token/db-load-account-by-access-token'
import { LoadAccountByAccessToken } from '$/domain/usecases/account/load-account-by-access-token'
import { JwtAdapter } from '$/infra/criptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '$/infra/db/mongodb/account/account-mongo-repository'
import env from '$/main/config/env'

export const makeDbLoadAccountByAccessToken = (): LoadAccountByAccessToken => {
  const jwtAdapter = new JwtAdapter(
    env.jwtSecret,
    env.accessTokenExpiration,
    env.refreshTokenExpiration
  )
  const accountMongoRepository = new AccountMongoRepository()
  return new DbLoadAccountByAccessToken(jwtAdapter, accountMongoRepository)
}
