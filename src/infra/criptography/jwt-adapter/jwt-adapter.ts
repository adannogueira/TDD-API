import jwt from 'jsonwebtoken'
import { Decrypter } from '../../../data/protocols/criptography/decrypter'
import { Encrypter } from '../../../data/protocols/criptography/encrypter'
import { AuthExpiredError } from '../../../presentation/errors'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secret: string) {}

  async encrypt (value: string): Promise<string> {
    const token = jwt.sign({ id: value }, this.secret)
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
}
