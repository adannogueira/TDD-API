import { mockAccessDecrypter } from '$tests/data/mocks'
import { AuthExpiredError } from '$/presentation/errors'
import { ok, serverError, unauthorized } from '$/presentation/helpers/http/http-helper'
import { RefreshMiddleware } from '$/presentation/middlewares/refresh/refresh-middleware'
import { AccessDecrypter } from '$/presentation/middlewares/refresh/refresh-middleware-protocols'

describe('Refresh Middleware', () => {
  test('Should return 401 if no token exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 401 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({
      refreshToken: 'any_refresh_token'
    })
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 401 if no x-refresh-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({
      accessToken: 'any_access_token'
    })
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 401 if accessToken is not expired', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 200 if accessToken is expired', async () => {
    const { sut, accessDecrypterStub } = makeSut()
    jest.spyOn(accessDecrypterStub, 'decrypt')
      .mockRejectedValueOnce(new AuthExpiredError())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok({ refreshToken: 'any_refresh_token' }))
  })

  test('Should return 500 if Decrypter throws', async () => {
    const { sut, accessDecrypterStub } = makeSut()
    jest.spyOn(accessDecrypterStub, 'decrypt')
      .mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})

const mockRequest = (): RefreshMiddleware.Request => ({
  accessToken: 'any_access_token',
  refreshToken: 'any_refresh_token'
})

type SutTypes = {
  sut: RefreshMiddleware
  accessDecrypterStub: AccessDecrypter
}

const makeSut = (): SutTypes => {
  const accessDecrypterStub = mockAccessDecrypter()
  const sut = new RefreshMiddleware(accessDecrypterStub)
  return {
    sut,
    accessDecrypterStub
  }
}
