import { AccessDecrypter } from '../../../../../data/protocols/criptography/access-decrypter'
import { JwtAdapter } from '@infra/criptography/jwt-adapter/jwt-adapter'
import env from '../../../../config/env'

export const makeDecrypterFactory = (): AccessDecrypter => {
  return new JwtAdapter(
    env.jwtSecret,
    env.accessTokenExpiration,
    env.refreshTokenExpiration
  )
}
