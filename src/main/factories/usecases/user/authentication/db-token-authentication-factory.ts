import { DbAuthentication } from '$/data/usecases/authentication/db-authentication'
import { TokenAuthentication } from '$/domain/usecases/account/token-authentication'
import { BcryptAdapter } from '$/infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '$/infra/criptography/jwt-adapter/jwt-adapter'
import { UuidAdapter } from '$/infra/criptography/uuid-adapter/uuid-adapter'
import { AccountMongoRepository } from '$/infra/db/mongodb/account/account-mongo-repository'
import env from '$/main/config/env'

export const makeDbTokenAuthentication = (): TokenAuthentication => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(
    env.jwtSecret,
    env.accessTokenExpiration,
    env.refreshTokenExpiration
  )
  const accountMongoRepository = new AccountMongoRepository()
  const idGenerator = new UuidAdapter()
  return new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository,
    accountMongoRepository,
    idGenerator
  )
}
