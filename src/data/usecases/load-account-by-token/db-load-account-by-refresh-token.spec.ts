import { AccountModel } from '../../../domain/models/account'
import { RefreshDecrypter } from '../../protocols/criptography/refresh-decrypter'
import { DbLoadAccountByRefreshToken } from './db-load-account-by-refresh-token'
import { LoadAccountByRefreshTokenIdRepository } from '../../protocols/db/account/load-account-by-refresh-token-id-repository'

describe('DbLoadAccountByRefreshToken Usecase', () => {
  test('Should call RefreshDecrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decryptRefresh')
    await sut.load('any_token')
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })

  test('Should return null if RefreshDecrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decryptRefresh').mockReturnValueOnce(Promise.resolve(null as any))
    const account = await sut.load('any_token')
    expect(account).toBeNull()
  })

  test('Should call LoadAccountByRefreshTokenRepo with correct values', async () => {
    const { sut, loadAccountByRefreshTokenRepoStub } = makeSut()
    const loadByTokenSpy = jest.spyOn(loadAccountByRefreshTokenRepoStub, 'loadByRefreshTokenId')
    await sut.load('any_token')
    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token')
  })

  test('Should return null if LoadAccountByRefreshTokenRepo returns null', async () => {
    const { sut, loadAccountByRefreshTokenRepoStub } = makeSut()
    jest
      .spyOn(loadAccountByRefreshTokenRepoStub, 'loadByRefreshTokenId')
      .mockReturnValueOnce(Promise.resolve(null as any))
    const account = await sut.load('any_token')
    expect(account).toBeNull()
  })

  test('Should throw if RefreshDecrypter throws', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decryptRefresh').mockRejectedValueOnce(new Error())
    const promise = sut.load('any_token')
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if LoadAccountByRefreshTokenRepo throws', async () => {
    const { sut, loadAccountByRefreshTokenRepoStub } = makeSut()
    jest.spyOn(loadAccountByRefreshTokenRepoStub, 'loadByRefreshTokenId').mockRejectedValueOnce(new Error())
    const promise = sut.load('any_token')
    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.load('any_token')
    expect(account).toEqual(makeFakeAccount())
  })
})

interface sutTypes {
  sut: DbLoadAccountByRefreshToken
  decrypterStub: RefreshDecrypter
  loadAccountByRefreshTokenRepoStub: LoadAccountByRefreshTokenIdRepository
}

const makeSut = (): sutTypes => {
  const decrypterStub = makeDecrypter()
  const loadAccountByRefreshTokenRepoStub = makeLoadAccountByRefreshTokenRepo()
  const sut = new DbLoadAccountByRefreshToken(decrypterStub, loadAccountByRefreshTokenRepoStub)
  return {
    sut,
    decrypterStub,
    loadAccountByRefreshTokenRepoStub
  }
}

const makeDecrypter = (): RefreshDecrypter => {
  class DecrypterStub implements RefreshDecrypter {
    async decryptRefresh (value: string): Promise<string> {
      return await Promise.resolve('any_value')
    }
  }
  return new DecrypterStub()
}

const makeLoadAccountByRefreshTokenRepo = (): LoadAccountByRefreshTokenIdRepository => {
  class LoadAccountByRefreshTokenIdRepoStub implements LoadAccountByRefreshTokenIdRepository {
    async loadByRefreshTokenId (tokenId: string): Promise<AccountModel> {
      return await Promise.resolve(makeFakeAccount())
    }
  }
  return new LoadAccountByRefreshTokenIdRepoStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})
