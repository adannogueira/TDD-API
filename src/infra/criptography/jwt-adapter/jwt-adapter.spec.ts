import jwt from 'jsonwebtoken'
import { AuthExpiredError } from '../../../presentation/errors'
import { JwtAdapter } from './jwt-adapter'

describe('Jwt Adapter', () => {
  describe('sign()', () => {
    test('Should call sign with correct values', async () => {
      const sut = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')
      await sut.encrypt('any_id')
      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
    })

    test('Should return a token on sign success', async () => {
      const sut = makeSut()
      const token = await sut.encrypt('any_id')
      expect(token).toBe('any_token')
    })

    test('Should throw if sign throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'sign')
        .mockImplementationOnce(() => { throw new Error() })
      const promise = sut.encrypt('any_id')
      await expect(promise).rejects.toThrow()
    })
  })

  describe('verify()', () => {
    test('Should call sign with correct values', async () => {
      const sut = makeSut()
      const verifySpy = jest.spyOn(jwt, 'verify')
      await sut.decrypt('any_token')
      expect(verifySpy).toHaveBeenCalledWith('any_token', 'secret')
    })

    test('Should return a value on verify success', async () => {
      const sut = makeSut()
      const token = await sut.decrypt('any_token')
      expect(token).toBe('any_id')
    })

    test('Should throw if verify throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'verify')
        .mockImplementationOnce(() => { throw new Error() })
      const promise = sut.decrypt('any_token')
      await expect(promise).rejects.toThrow()
    })

    test('Should throw AuthExpiredError if verify throws ExpiredTokenError', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'verify')
        .mockImplementationOnce(() => {
          throw makeTokenError()
        })
      const promise = sut.decrypt('any_token')
      await expect(promise).rejects.toThrow(new AuthExpiredError())
    })
  })
})

jest.mock('jsonwebtoken', () => ({
  sign: (): string => {
    return 'any_token'
  },

  verify: (): string => {
    return 'any_id'
  }
}))

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret')
}

const makeTokenError = (): jwt.TokenExpiredError => {
  class TokenExpiredError extends Error {
    expiredAt: Date
    inner: Error
    constructor () {
      super('any_error')
      this.name = 'TokenExpiredError'
      this.message = 'any_message'
    }
  }
  return new TokenExpiredError()
}
