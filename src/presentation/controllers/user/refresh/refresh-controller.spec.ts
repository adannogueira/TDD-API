import { mockAccount } from '$/domain/test'
import { AuthExpiredError } from '$/presentation/errors'
import { ok, serverError, unauthorized } from '$/presentation/helpers/http/http-helper'
import { mockLoadAccountByRefreshToken, mockTokenAuthentication } from '$/presentation/test'
import {
  HttpRequest,
  LoadAccountByRefreshToken,
  TokenAuthentication
} from './refresh-controller-protocols'
import { RefreshController } from './refresh-controller'

describe('Refresh Controller', () => {
  test('Should call LoadAccountByRefreshToken with correct values', async () => {
    const { sut, loadAccountByRefreshTokenStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByRefreshTokenStub, 'load')
    await sut.handle(mockRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_token')
  })

  test('Should return 500 if LoadAccountByRefreshToken throws', async () => {
    const { sut, loadAccountByRefreshTokenStub } = makeSut()
    jest.spyOn(loadAccountByRefreshTokenStub, 'load')
      .mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should call TokenAuthentication with correct values', async () => {
    const { sut, tokenAuthenticationStub } = makeSut()
    const authSpy = jest.spyOn(tokenAuthenticationStub, 'authByAccount')
    await sut.handle(mockRequest())
    expect(authSpy).toHaveBeenCalledWith(mockAccount())
  })

  test('Should return 500 if TokenAuthentication throws', async () => {
    const { sut, tokenAuthenticationStub } = makeSut()
    jest.spyOn(tokenAuthenticationStub, 'authByAccount')
      .mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok({
      accessToken: 'any_access_token',
      refreshToken: 'any_refresh_token',
      name: 'any_name'
    }))
  })

  test('Should return 401 if an invalid token is provided', async () => {
    const { sut, loadAccountByRefreshTokenStub } = makeSut()
    jest.spyOn(loadAccountByRefreshTokenStub, 'load')
      .mockResolvedValueOnce(null)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 401 if loadAccountByRefreshToken throws AuthExpiredError', async () => {
    const { sut, loadAccountByRefreshTokenStub } = makeSut()
    jest.spyOn(loadAccountByRefreshTokenStub, 'load')
      .mockImplementationOnce(() => {
        throw new AuthExpiredError()
      })
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(unauthorized())
  })
})

const mockRequest = (): HttpRequest => ({
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
  const loadAccountByRefreshTokenStub = mockLoadAccountByRefreshToken()
  const tokenAuthenticationStub = mockTokenAuthentication()
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
