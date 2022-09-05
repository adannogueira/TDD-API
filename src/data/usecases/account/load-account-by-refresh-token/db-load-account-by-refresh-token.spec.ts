import { mockLoadAccountByRefreshTokenRepositoryStub, mockDecrypter } from '$/data/test'
import { DbLoadAccountByRefreshToken } from './db-load-account-by-refresh-token'
import {
  LoadAccountByRefreshTokenIdRepository,
  RefreshDecrypter
} from './load-account-by-refresh-token-protocols'

describe('DbLoadAccountByRefreshToken Usecase', () => {
  test('Should call RefreshDecrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decryptRefresh')
    await sut.load('any_token')
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })

  test('Should return null if RefreshDecrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decryptRefresh')
      .mockResolvedValueOnce(null)
    const account = await sut.load('any_token')
    expect(account).toBeNull()
  })

  test('Should call LoadAccountByRefreshTokenIdRepo with correct values', async () => {
    const { sut, loadAccountByRefreshTokenIdRepoStub } = makeSut()
    const loadByTokenSpy = jest.spyOn(loadAccountByRefreshTokenIdRepoStub, 'loadByRefreshTokenId')
    await sut.load('any_token')
    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token_id')
  })

  test('Should return null if LoadAccountByRefreshTokenRepo returns null', async () => {
    const { sut, loadAccountByRefreshTokenIdRepoStub } = makeSut()
    jest
      .spyOn(loadAccountByRefreshTokenIdRepoStub, 'loadByRefreshTokenId')
      .mockResolvedValueOnce(null)
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
    const { sut, loadAccountByRefreshTokenIdRepoStub } = makeSut()
    jest.spyOn(loadAccountByRefreshTokenIdRepoStub, 'loadByRefreshTokenId').mockRejectedValueOnce(new Error())
    const promise = sut.load('any_token')
    await expect(promise).rejects.toThrow()
  })

  test('Should return an account without password field on success', async () => {
    const { sut } = makeSut()
    const account = await sut.load('any_token')
    expect(account).toEqual({
      id: 'any_id',
      name: 'any_name',
      email: 'any_email@mail.com'
    })
  })
})

type SutTypes = {
  sut: DbLoadAccountByRefreshToken
  decrypterStub: RefreshDecrypter
  loadAccountByRefreshTokenIdRepoStub: LoadAccountByRefreshTokenIdRepository
}

const makeSut = (): SutTypes => {
  const decrypterStub = mockDecrypter()
  const loadAccountByRefreshTokenIdRepoStub = mockLoadAccountByRefreshTokenRepositoryStub()
  const sut = new DbLoadAccountByRefreshToken(decrypterStub, loadAccountByRefreshTokenIdRepoStub)
  return {
    sut,
    decrypterStub,
    loadAccountByRefreshTokenIdRepoStub
  }
}
