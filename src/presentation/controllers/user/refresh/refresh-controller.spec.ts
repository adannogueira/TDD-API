import { HttpRequest, Validation } from './refresh-controller-protocols'
import { RefreshController } from './refresh-controller'

describe('Refresh Controller', () => {
  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.headers)
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
