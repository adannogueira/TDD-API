import jwt from 'jsonwebtoken'
import { Decrypter } from '../../../data/protocols/criptography/decrypter'
import { Encrypter } from '../../../data/protocols/criptography/encrypter'
import { RefreshEncrypter } from '../../../data/protocols/criptography/refresh-encrypter'
import { AuthExpiredError } from '../../../presentation/errors'

export class JwtAdapter implements Encrypter, Decrypter, RefreshEncrypter {
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
      console.log(value)
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
}
