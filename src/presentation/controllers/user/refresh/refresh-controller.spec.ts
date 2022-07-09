import { HttpRequest, Validation } from './refresh-controller-protocols'
import { RefreshController } from './refresh-controller'
import { badRequest } from '../../../helpers/http/http-helper'

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
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new Error()))
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

const makeFakeRequest = (): HttpRequest => ({
  headers: {
    'x-refresh-token': 'any_token'
  }
})

interface sutTypes {
  sut: RefreshController
  validationStub: Validation
}

const makeSut = (): sutTypes => {
  const validationStub = makeValidation()
  const sut = new RefreshController(validationStub)
  return {
    sut,
    validationStub
  }
}
