import { MissingParamError } from '$/presentation/errors'
import { badRequest, ok, serverError, unauthorized } from '$/presentation/helpers/http/http-helper'
import { mockValidation, mockPasswordAuthentication } from '$tests/presentation/mocks'
import {
  HttpRequest,
  PasswordAuthentication,
  Validation
} from '$/presentation/controllers/user/login/login-controller-protocols'
import { LoginController } from '$/presentation/controllers/user/login/login-controller'

describe('Login Controller', () => {
  test('Should return 500 if Authentication throws', async () => {
    const { sut, passwordAuthenticationStub } = makeSut()
    jest.spyOn(passwordAuthenticationStub, 'authByPassword')
      .mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, passwordAuthenticationStub } = makeSut()
    const authSpy = jest.spyOn(passwordAuthenticationStub, 'authByPassword')
    await sut.handle(mockRequest())
    expect(authSpy).toHaveBeenCalledWith({
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, passwordAuthenticationStub } = makeSut()
    jest.spyOn(passwordAuthenticationStub, 'authByPassword')
      .mockResolvedValueOnce(null)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok({
      accessToken: 'any_token',
      refreshToken: 'any_refresh_token',
      name: 'any_name'
    }))
  })

  test('Should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(mockRequest())
    expect(validateSpy).toHaveBeenCalledWith(mockRequest().body)
  })

  test('Should return 400 if Validation throws', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})

const mockRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

type SutTypes = {
  sut: LoginController
  passwordAuthenticationStub: PasswordAuthentication
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const validationStub = mockValidation()
  const passwordAuthenticationStub = mockPasswordAuthentication()
  const sut = new LoginController(
    passwordAuthenticationStub,
    validationStub)
  return {
    sut,
    passwordAuthenticationStub,
    validationStub
  }
}
