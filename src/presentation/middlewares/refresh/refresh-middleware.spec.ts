import { AuthExpiredError } from '../../errors'
import { ok, serverError, unauthorized } from '../../helpers/http/http-helper'
import { RefreshMiddleware } from './refresh-middleware'
import { HttpRequest, AccessDecrypter } from './refresh-middleware-protocols'

describe('Refresh Middleware', () => {
  test('Should return 401 if no token exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 401 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({
      headers: {
        'x-refresh-token': 'any_refresh_token'
      }
    })
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 401 if no x-refresh-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({
      headers: {
        'x-access-token': 'any_access_token'
      }
    })
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 401 if accessToken is not expired', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 200 if accessToken is expired', async () => {
    const { sut, accessDecrypterStub } = makeSut()
    jest.spyOn(accessDecrypterStub, 'decrypt')
      .mockRejectedValueOnce(new AuthExpiredError())
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ refreshToken: 'any_refresh_token' }))
  })

  test('Should return 500 if Decrypter throws', async () => {
    const { sut, accessDecrypterStub } = makeSut()
    jest.spyOn(accessDecrypterStub, 'decrypt')
      .mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})

const makeFakeRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any_access_token',
    'x-refresh-token': 'any_refresh_token'
  }
})

const makeAccessDecrypter = (): AccessDecrypter => {
  class AccessDecrypterStub implements AccessDecrypter {
    async decrypt (value: string): Promise<string> {
      return await Promise.resolve('any_value')
    }
  }
  return new AccessDecrypterStub()
}

interface sutTypes {
  sut: RefreshMiddleware
  accessDecrypterStub: AccessDecrypter
}

const makeSut = (): sutTypes => {
  const accessDecrypterStub = makeAccessDecrypter()
  const sut = new RefreshMiddleware(accessDecrypterStub)
  return {
    sut,
    accessDecrypterStub
  }
}
