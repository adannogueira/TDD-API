import { AccountModel } from '$/domain/models/account'
import {
  HttpRequest,
  LoadAccountByRefreshToken,
  Tokens,
  TokenAuthentication
} from './refresh-controller-protocols'
import { RefreshController } from './refresh-controller'
import { ok, serverError, unauthorized } from '../../../helpers/http/http-helper'
import { AuthExpiredError } from '../../../errors'

describe('Refresh Controller', () => {
  test('Should call LoadAccountByRefreshToken with correct values', async () => {
    const { sut, loadAccountByRefreshTokenStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByRefreshTokenStub, 'load')
    await sut.handle(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_token')
  })

  test('Should return 500 if LoadAccountByRefreshToken throws', async () => {
    const { sut, loadAccountByRefreshTokenStub } = makeSut()
    jest.spyOn(loadAccountByRefreshTokenStub, 'load').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should call TokenAuthentication with correct values', async () => {
    const { sut, tokenAuthenticationStub } = makeSut()
    const authSpy = jest.spyOn(tokenAuthenticationStub, 'authByAccount')
    await sut.handle(makeFakeRequest())
    expect(authSpy).toHaveBeenCalledWith(makeFakeAccount())
  })

  test('Should return 500 if TokenAuthentication throws', async () => {
    const { sut, tokenAuthenticationStub } = makeSut()
    jest.spyOn(tokenAuthenticationStub, 'authByAccount')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({
      accessToken: 'any_access_token',
      refreshToken: 'any_refresh_token'
    }))
  })

  test('Should return 401 if an invalid token is provided', async () => {
    const { sut, loadAccountByRefreshTokenStub } = makeSut()
    jest.spyOn(loadAccountByRefreshTokenStub, 'load')
      .mockReturnValueOnce(Promise.resolve(null as any))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 401 if loadAccountByRefreshToken throws AuthExpiredError', async () => {
    const { sut, loadAccountByRefreshTokenStub } = makeSut()
    jest.spyOn(loadAccountByRefreshTokenStub, 'load')
      .mockImplementationOnce(() => {
        throw new AuthExpiredError()
      })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(unauthorized())
  })
})

const makeLoadAccountByRefreshToken = (): LoadAccountByRefreshToken => {
  class LoadAccountByRefreshTokenStub implements LoadAccountByRefreshToken {
    async load (refreshToken: string): Promise<AccountModel> {
      return await Promise.resolve(makeFakeAccount())
    }
  }
  return new LoadAccountByRefreshTokenStub()
}

const makeAuthentication = (): TokenAuthentication => {
  class AuthenticationStub implements TokenAuthentication {
    async authByAccount (account: AccountModel): Promise<Tokens> {
      return await Promise.resolve({
        accessToken: 'any_access_token',
        refreshToken: 'any_refresh_token'
      })
    }
  }
  return new AuthenticationStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid@email.com'
})

const makeFakeRequest = (): HttpRequest => ({
  body: {
    refreshToken: 'any_token'
  }
})

type SutTypes = {
  sut: RefreshController
  loadAccountByRefreshTokenStub: LoadAccountByRefreshToken
  tokenAuthenticationStub: TokenAuthentication
}

const makeSut = (): SutTypes => {
  const loadAccountByRefreshTokenStub = makeLoadAccountByRefreshToken()
  const tokenAuthenticationStub = makeAuthentication()
  const sut = new RefreshController(
    loadAccountByRefreshTokenStub,
    tokenAuthenticationStub
  )
  return {
    sut,
    loadAccountByRefreshTokenStub,
    tokenAuthenticationStub
  }
}
