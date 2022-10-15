import { mockAccessDecrypter, mockLoadAccountByAccessTokenRepositoryStub } from '$tests/data/mocks'
import { mockAccount } from '$tests/domain/mocks'
import { DbLoadAccountByAccessToken } from '$/data/usecases/account/load-account-by-access-token/db-load-account-by-access-token'
import {
  AccessDecrypter,
  LoadAccountByAccessTokenRepository
} from '$/data/usecases/account/load-account-by-access-token/load-account-by-access-token-protocols'

describe('DbLoadAccountByAccessToken Usecase', () => {
  test('Should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load('any_token', 'any_role')
    expect(decryptSpy).toHaveBeenCalledWith('any_token', 'any_role')
  })

  test('Should return null if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt')
      .mockResolvedValueOnce(null)
    const account = await sut.load('any_token', 'any_role')
    expect(account).toBeNull()
  })

  test('Should call LoadAccountByAccessTokenRepo with correct values', async () => {
    const { sut, loadAccountByAccessTokenRepoStub } = makeSut()
    const loadByTokenSpy = jest.spyOn(loadAccountByAccessTokenRepoStub, 'loadByAccessToken')
    await sut.load('any_token', 'any_role')
    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', 'any_role')
  })

  test('Should return null if LoadAccountByAccessTokenRepo returns null', async () => {
    const { sut, loadAccountByAccessTokenRepoStub } = makeSut()
    jest
      .spyOn(loadAccountByAccessTokenRepoStub, 'loadByAccessToken')
      .mockResolvedValueOnce(null)
    const account = await sut.load('any_token', 'any_role')
    expect(account).toBeNull()
  })

  test('Should throw if LoadAccountByAccessTokenRepo throws', async () => {
    const { sut, loadAccountByAccessTokenRepoStub } = makeSut()
    jest.spyOn(loadAccountByAccessTokenRepoStub, 'loadByAccessToken')
      .mockRejectedValueOnce(new Error())
    const promise = sut.load('any_token', 'any_role')
    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.load('any_token', 'any_role')
    expect(account).toEqual(mockAccount())
  })
})

type SutTypes = {
  sut: DbLoadAccountByAccessToken
  decrypterStub: AccessDecrypter
  loadAccountByAccessTokenRepoStub: LoadAccountByAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const decrypterStub = mockAccessDecrypter()
  const loadAccountByAccessTokenRepoStub = mockLoadAccountByAccessTokenRepositoryStub()
  const sut = new DbLoadAccountByAccessToken(
    decrypterStub,
    loadAccountByAccessTokenRepoStub
  )
  return {
    sut,
    decrypterStub,
    loadAccountByAccessTokenRepoStub
  }
}
