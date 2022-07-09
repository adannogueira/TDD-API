import { MissingParamError } from '../../../errors'
import { badRequest, ok, serverError, unauthorized } from '../../../helpers/http/http-helper'
import {
  AuthenticationModel,
  HttpRequest,
  PasswordAuthentication,
  Validation,
  Tokens
} from './login-controller-protocols'
import { LoginController } from './login-controller'

describe('Login Controller', () => {
  test('Should return 500 if Authentication throws', async () => {
    const { sut, passwordAuthenticationStub } = makeSut()
    jest.spyOn(passwordAuthenticationStub, 'authByPassword')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, passwordAuthenticationStub } = makeSut()
    const authSpy = jest.spyOn(passwordAuthenticationStub, 'authByPassword')
    await sut.handle(makeFakeRequest())
    expect(authSpy).toHaveBeenCalledWith({
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, passwordAuthenticationStub } = makeSut()
    jest.spyOn(passwordAuthenticationStub, 'authByPassword')
      .mockReturnValueOnce(Promise.resolve(null as any))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({
      accessToken: 'any_token',
      refreshToken: 'any_refresh_token'
    }))
  })

  test('Should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(makeFakeRequest())
    expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest().body)
  })

  test('Should return 400 if Validation throws', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})

const makeAuthentication = (): PasswordAuthentication => {
  class PasswordAuthenticationStub implements PasswordAuthentication {
    async authByPassword (authentication: AuthenticationModel): Promise<Tokens> {
      return await Promise.resolve({
        accessToken: 'any_token',
        refreshToken: 'any_refresh_token'
      })
    }
  }
  return new PasswordAuthenticationStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null as any
    }
  }
  return new ValidationStub()
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

interface sutTypes {
  sut: LoginController
  passwordAuthenticationStub: PasswordAuthentication
  validationStub: Validation
}

const makeSut = (): sutTypes => {
  const validationStub = makeValidation()
  const passwordAuthenticationStub = makeAuthentication()
  const sut = new LoginController(
    passwordAuthenticationStub,
    validationStub)
  return {
    sut,
    passwordAuthenticationStub,
    validationStub
  }
}
