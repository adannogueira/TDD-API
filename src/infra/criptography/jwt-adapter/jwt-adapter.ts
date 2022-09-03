import { AccessDecrypter } from '@data/protocols/criptography/access-decrypter'
import { AccessEncrypter } from '@data/protocols/criptography/access-encrypter'
import { RefreshDecrypter } from '@data/protocols/criptography/refresh-decrypter'
import { RefreshEncrypter } from '@data/protocols/criptography/refresh-encrypter'
import { AuthExpiredError } from '@presentation/errors'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements AccessEncrypter, AccessDecrypter, RefreshEncrypter, RefreshDecrypter {
  constructor (
    private readonly secret: string,
    private readonly accessTokenExpiration: string,
    private readonly refreshTokenExpiration: string
  ) {}

  async encrypt (value: string): Promise<string> {
    const token = jwt.sign(
      { id: value },
      this.secret,
      { expiresIn: this.accessTokenExpiration }
    )
    return token
  }

  async decrypt (token: string): Promise<string> {
    try {
      const value = jwt.verify(token, this.secret)
      return value as string
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new AuthExpiredError()
      }
      throw error
    }
  }

  async encryptRefresh (value: string, jti: string): Promise<string> {
    const token = jwt.sign(
      { id: value },
      this.secret,
      {
        expiresIn: this.refreshTokenExpiration,
        jwtid: jti
      }
    )
    return token
  }

  async decryptRefresh (token: string): Promise<string> {
    try {
      const value = jwt.verify(token, this.secret) as jwt.JwtPayload
      return value.jti
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new AuthExpiredError()
      }
      throw error
    }
  }
}
