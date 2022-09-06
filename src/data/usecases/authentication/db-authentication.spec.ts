import {
  Encrypter,
  mockEncrypter,
  mockHashComparer,
  mockIdGenerator,
  mockLoadAccountByEmailRepositoryStub,
  mockUpdateAccessTokenRepositoryStub,
  mockUpdateRefreshTokenRepositoryStub
} from '$/data/test'
import { mockAccount, mockAuthentication } from '$/domain/test'
import { DbAuthentication } from './db-authentication'
import {
  HashComparer,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
  IdGenerator,
  UpdateRefreshTokenRepository
} from './db-authentication-protocols'

describe('DbAuthentication UseCase', () => {
  describe('authByPassword()', () => {
    test('Should call LoadAccountByEmailRepo with correct email', async () => {
      const { sut, loadAccountByEmailRepository } = makeSut()
      const loadSpy = jest.spyOn(loadAccountByEmailRepository, 'loadByEmail')
      await sut.authByPassword(mockAuthentication())
      expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
    })

    test('Should throw if LoadAccountByEmailRepo throws', async () => {
      const { sut, loadAccountByEmailRepository } = makeSut()
      jest.spyOn(loadAccountByEmailRepository, 'loadByEmail')
        .mockRejectedValueOnce(new Error())
      const promise = sut.authByPassword(mockAuthentication())
      await expect(promise).rejects.toThrow()
    })

    test('Should return null if LoadAccountByEmailRepo returns null', async () => {
      const { sut, loadAccountByEmailRepository } = makeSut()
      jest.spyOn(loadAccountByEmailRepository, 'loadByEmail')
        .mockResolvedValueOnce(null)
      const accessToken = await sut.authByPassword(mockAuthentication())
      expect(accessToken).toBeNull()
    })

    test('Should call HashComparer with correct values', async () => {
      const { sut, hashComparerStub } = makeSut()
      const compareSpy = jest.spyOn(hashComparerStub, 'compare')
      await sut.authByPassword(mockAuthentication())
      expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
    })

    test('Should throw if HashComparer throws', async () => {
      const { sut, hashComparerStub } = makeSut()
      jest.spyOn(hashComparerStub, 'compare')
        .mockRejectedValueOnce(new Error())
      const promise = sut.authByPassword(mockAuthentication())
      await expect(promise).rejects.toThrow()
    })

    test('Should return null if HashComparer returns false', async () => {
      const { sut, hashComparerStub } = makeSut()
      jest.spyOn(hashComparerStub, 'compare')
        .mockResolvedValueOnce(false)
      const accessToken = await sut.authByPassword(mockAuthentication())
      expect(accessToken).toBeNull()
    })
  })

  describe('authByAccount()', () => {
    describe('getAccessToken()', () => {
      test('Should call Encrypter with correct id', async () => {
        const { sut, encrypterStub } = makeSut()
        const generateSpy = jest.spyOn(encrypterStub, 'encrypt')
        await sut.authByAccount(mockAccount())
        expect(generateSpy).toHaveBeenCalledWith('any_id')
      })

      test('Should call Encrypter refresh with correct id', async () => {
        const { sut, encrypterStub } = makeSut()
        const generateSpy = jest.spyOn(encrypterStub, 'encryptRefresh')
        await sut.authByAccount(mockAccount())
        expect(generateSpy).toHaveBeenCalledWith('any_id', 'any_token_id')
      })

      test('Should throw if Encrypter throws', async () => {
        const { sut, encrypterStub } = makeSut()
        jest.spyOn(encrypterStub, 'encrypt')
          .mockRejectedValueOnce(new Error())
        const promise = sut.authByAccount(mockAccount())
        await expect(promise).rejects.toThrow()
      })

      test('Should return an access token on auth success', async () => {
        const { sut } = makeSut()
        const tokens = await sut.authByAccount(mockAccount())
        expect(tokens.accessToken).toBe('any_token')
      })

      test('Should call UpdateAccessTokenRepository with correct values', async () => {
        const { sut, updateAccessTokenRepositoryStub } = makeSut()
        const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
        await sut.authByAccount(mockAccount())
        expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token')
      })

      test('Should throw if UpdateAccessTokenRepository throws', async () => {
        const { sut, updateAccessTokenRepositoryStub } = makeSut()
        jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
          .mockRejectedValueOnce(new Error())
        const promise = sut.authByAccount(mockAccount())
        await expect(promise).rejects.toThrow()
      })
    })

    describe('getRefreshToken()', () => {
      test('Should throw if Encrypter refresh throws', async () => {
        const { sut, encrypterStub } = makeSut()
        jest.spyOn(encrypterStub, 'encryptRefresh')
          .mockRejectedValueOnce(new Error())
        const promise = sut.authByAccount(mockAccount())
        await expect(promise).rejects.toThrow()
      })

      test('Should return a refresh token on auth success', async () => {
        const { sut } = makeSut()
        const tokens = await sut.authByAccount(mockAccount())
        expect(tokens.refreshToken).toBe('any_refresh_token')
      })

      test('Should call UpdateRefreshTokenRepository with correct values', async () => {
        const { sut, updateRefreshTokenRepositoryStub } = makeSut()
        const updateSpy = jest.spyOn(updateRefreshTokenRepositoryStub, 'updateRefreshToken')
        await sut.authByAccount(mockAccount())
        expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token_id')
      })

      test('Should throw if UpdateRefreshTokenRepository throws', async () => {
        const { sut, updateRefreshTokenRepositoryStub } = makeSut()
        jest.spyOn(updateRefreshTokenRepositoryStub, 'updateRefreshToken')
          .mockRejectedValueOnce(new Error())
        const promise = sut.authByAccount(mockAccount())
        await expect(promise).rejects.toThrow()
      })
    })
  })
})

type SutTypes = {
  sut: DbAuthentication
  loadAccountByEmailRepository: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  encrypterStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
  idGeneratorStub: IdGenerator
  updateRefreshTokenRepositoryStub: UpdateRefreshTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepository = mockLoadAccountByEmailRepositoryStub()
  const hashComparerStub = mockHashComparer()
  const encrypterStub = mockEncrypter()
  const updateAccessTokenRepositoryStub = mockUpdateAccessTokenRepositoryStub()
  const idGeneratorStub = mockIdGenerator()
  const updateRefreshTokenRepositoryStub = mockUpdateRefreshTokenRepositoryStub()
  const sut = new DbAuthentication(
    loadAccountByEmailRepository,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub,
    updateRefreshTokenRepositoryStub,
    idGeneratorStub
  )
  return {
    sut,
    loadAccountByEmailRepository,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub,
    idGeneratorStub,
    updateRefreshTokenRepositoryStub
  }
}
