import { EmailInUseError, MissingParamError, ServerError } from '$/presentation/errors'
import { badRequest, forbidden, ok, serverError } from '$/presentation/helpers/http/http-helper'
import { mockAddAccount, mockPasswordAuthentication, mockValidation } from '$tests/presentation/mocks'
import {
  AddAccount,
  HttpRequest,
  Validation,
  PasswordAuthentication
} from '$/presentation/controllers/user/signup/signup-controller-protocols'
import { SignUpController } from '$/presentation/controllers/user/signup/signup-controller'

describe('SignUp Controller', () => {
  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handle(mockRequest())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add')
      .mockRejectedValueOnce(new Error('any error'))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new ServerError('any error')))
  })

  test('Should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add')
      .mockResolvedValueOnce(null)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })

  test('Should return 200 if valid data is provided', async () => {
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

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'authByPassword')
    await sut.handle(mockRequest())
    expect(authSpy).toHaveBeenCalledWith({
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'authByPassword')
      .mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})

const mockRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

type SutTypes = {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
  authenticationStub: PasswordAuthentication
}

const makeSut = (): SutTypes => {
  const authenticationStub = mockPasswordAuthentication()
  const addAccountStub = mockAddAccount()
  const validationStub = mockValidation()
  const sut = new SignUpController(
    addAccountStub,
    validationStub,
    authenticationStub
  )
  return {
    sut,
    addAccountStub,
    validationStub,
    authenticationStub
  }
}
