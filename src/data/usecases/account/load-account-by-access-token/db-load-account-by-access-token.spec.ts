import { DbLoadAccountByAccessToken } from './db-load-account-by-access-token'
import {
  AccessDecrypter,
  AccountModel,
  LoadAccountByAccessTokenRepository
} from './load-account-by-access-token-protocols'

describe('DbLoadAccountByAccessToken Usecase', () => {
  test('Should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load('any_token', 'any_role')
    expect(decryptSpy).toHaveBeenCalledWith('any_token', 'any_role')
  })

  test('Should return null if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(Promise.resolve(null as any))
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
      .mockReturnValueOnce(Promise.resolve(null as any))
    const account = await sut.load('any_token', 'any_role')
    expect(account).toBeNull()
  })

  test('Should throw if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockRejectedValueOnce(new Error())
    const promise = sut.load('any_token', 'any_role')
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if LoadAccountByAccessTokenRepo throws', async () => {
    const { sut, loadAccountByAccessTokenRepoStub } = makeSut()
    jest.spyOn(loadAccountByAccessTokenRepoStub, 'loadByAccessToken').mockRejectedValueOnce(new Error())
    const promise = sut.load('any_token', 'any_role')
    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.load('any_token', 'any_role')
    expect(account).toEqual(makeFakeAccount())
  })
})

type SutTypes = {
  sut: DbLoadAccountByAccessToken
  decrypterStub: AccessDecrypter
  loadAccountByAccessTokenRepoStub: LoadAccountByAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter()
  const loadAccountByAccessTokenRepoStub = makeLoadAccountByAccessTokenRepo()
  const sut = new DbLoadAccountByAccessToken(decrypterStub, loadAccountByAccessTokenRepoStub)
  return {
    sut,
    decrypterStub,
    loadAccountByAccessTokenRepoStub
  }
}

const makeDecrypter = (): AccessDecrypter => {
  class DecrypterStub implements AccessDecrypter {
    async decrypt (value: string): Promise<string> {
      return await Promise.resolve('any_value')
    }
  }
  return new DecrypterStub()
}

const makeLoadAccountByAccessTokenRepo = (): LoadAccountByAccessTokenRepository => {
  class LoadAccountByAccessTokenRepoStub implements LoadAccountByAccessTokenRepository {
    async loadByAccessToken (accessToken: string, role?: string): Promise<AccountModel> {
      return await Promise.resolve(makeFakeAccount())
    }
  }
  return new LoadAccountByAccessTokenRepoStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})
