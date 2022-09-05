import { mockAccount } from '$/domain/test'
import { AccessDeniedError, AuthExpiredError } from '$/presentation/errors'
import { forbidden, ok, serverError } from '$/presentation/helpers/http/http-helper'
import { AuthMiddleware } from './auth-middleware'
import { LoadAccountByAccessToken, AccountModel, HttpRequest } from './auth-middleware-protocols'

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should call LoadAccountByAccessToken with correct accessToken', async () => {
    const role = 'any_role'
    const { sut, loadAccountByAccessTokenStub } = makeSut(role)
    const loadSpy = jest.spyOn(loadAccountByAccessTokenStub, 'load')
    await sut.handle(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_token', role)
  })

  test('Should return 403 if LoadAccountByAccessToken returns null', async () => {
    const { sut, loadAccountByAccessTokenStub } = makeSut()
    jest.spyOn(loadAccountByAccessTokenStub, 'load').mockReturnValueOnce(Promise.resolve(null) as any)
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return 403 if LoadAccountByAccessToken throws AuthExpiredError', async () => {
    const { sut, loadAccountByAccessTokenStub } = makeSut()
    jest
      .spyOn(loadAccountByAccessTokenStub, 'load')
      .mockReturnValueOnce(Promise.reject(new AuthExpiredError()))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return 500 if LoadAccountByAccessToken throws', async () => {
    const { sut, loadAccountByAccessTokenStub } = makeSut()
    jest.spyOn(loadAccountByAccessTokenStub, 'load').mockReturnValueOnce(Promise.reject(new Error()))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 if LoadAccountByAccessToken returns an account', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ accountId: 'any_id' }))
  })
})

type SutTypes = {
  sut: AuthMiddleware
  loadAccountByAccessTokenStub: LoadAccountByAccessToken
}

const makeFakeRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any_token'
  }
})

const makeLoadAccountByAccessToken = (): LoadAccountByAccessToken => {
  class LoadAccountByAccessTokenStub implements LoadAccountByAccessToken {
    async load (accessToken: string, role?: string): Promise<AccountModel> {
      return await Promise.resolve(mockAccount())
    }
  }
  return new LoadAccountByAccessTokenStub()
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByAccessTokenStub = makeLoadAccountByAccessToken()
  const sut = new AuthMiddleware(loadAccountByAccessTokenStub, role)
  return {
    sut,
    loadAccountByAccessTokenStub
  }
}
