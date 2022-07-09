import {
  HttpRequest,
  LoadAccountByRefreshToken,
  Tokens,
  TokenAuthentication,
  Validation
} from './refresh-controller-protocols'
import { RefreshController } from './refresh-controller'
import { badRequest, serverError } from '../../../helpers/http/http-helper'
import { AccountModel } from '../../../../domain/models/account'

describe('Refresh Controller', () => {
  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.headers)
  })

  test('Should return 400 if Validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new Error()))
  })

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
})

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null as any
    }
  }
  return new ValidationStub()
}

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
  headers: {
    'x-refresh-token': 'any_token'
  }
})

interface sutTypes {
  sut: RefreshController
  validationStub: Validation
  loadAccountByRefreshTokenStub: LoadAccountByRefreshToken
  tokenAuthenticationStub: TokenAuthentication
}

const makeSut = (): sutTypes => {
  const validationStub = makeValidation()
  const loadAccountByRefreshTokenStub = makeLoadAccountByRefreshToken()
  const tokenAuthenticationStub = makeAuthentication()
  const sut = new RefreshController(
    validationStub,
    loadAccountByRefreshTokenStub,
    tokenAuthenticationStub
  )
  return {
    sut,
    validationStub,
    loadAccountByRefreshTokenStub,
    tokenAuthenticationStub
  }
}
