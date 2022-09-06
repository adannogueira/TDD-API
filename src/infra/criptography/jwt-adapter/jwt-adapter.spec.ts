import { AuthExpiredError } from '$/presentation/errors'
import { JwtAdapter } from './jwt-adapter'
import jwt from 'jsonwebtoken'

describe('Jwt Adapter', () => {
  describe('encrypt()', () => {
    test('Should call sign with correct values', async () => {
      const sut = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')
      await sut.encrypt('any_id')
      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret', { expiresIn: 'access time' })
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

  describe('decrypt()', () => {
    test('Should call verify with correct values', async () => {
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
          throw mockTokenError()
        })
      const promise = sut.decrypt('any_token')
      await expect(promise).rejects.toThrow(new AuthExpiredError())
    })
  })

  describe('encryptRefresh()', () => {
    test('Should call sign with correct values', async () => {
      const sut = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')
      await sut.encryptRefresh('any_id', 'any_jti')
      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret', { expiresIn: 'refresh time', jwtid: 'any_jti' })
    })

    test('Should return a token on sign success', async () => {
      const sut = makeSut()
      const token = await sut.encryptRefresh('any_id', 'any_jti')
      expect(token).toBe('any_token')
    })

    test('Should throw if sign throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'sign')
        .mockImplementationOnce(() => { throw new Error() })
      const promise = sut.encryptRefresh('any_id', 'any_jti')
      await expect(promise).rejects.toThrow()
    })
  })

  describe('decryptRefresh()', () => {
    test('Should call verify with correct values', async () => {
      const sut = makeSut()
      const verifySpy = jest.spyOn(jwt, 'verify')
      await sut.decryptRefresh('any_token')
      expect(verifySpy).toHaveBeenCalledWith('any_token', 'secret')
    })

    test('Should return a value on verify success', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => ({ jti: 'any_jti' }))
      const token = await sut.decryptRefresh('any_token')
      expect(token).toBe('any_jti')
    })

    test('Should throw if verify throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'verify')
        .mockImplementationOnce(() => { throw new Error() })
      const promise = sut.decryptRefresh('any_token')
      await expect(promise).rejects.toThrow()
    })

    test('Should throw AuthExpiredError if verify throws ExpiredTokenError', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'verify')
        .mockImplementationOnce(() => {
          throw mockTokenError()
        })
      const promise = sut.decryptRefresh('any_token')
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
  return new JwtAdapter('secret', 'access time', 'refresh time')
}

const mockTokenError = (): jwt.TokenExpiredError => {
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
