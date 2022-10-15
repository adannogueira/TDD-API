import { LogErrorRepository } from '$/data/protocols/db/log/log-error-repository'
import { mockLogErrorRepositoryStub } from '$tests/data/mocks'
import { mockAccount } from '$tests/domain/mocks'
import { ok, serverError } from '$/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '$/presentation/protocols'
import { mockController } from '$/../tests/presentation/mocks'
import { LogControllerDecorator } from '$/main/decorators/log-controller-decorator'

describe('LogControllerDecorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    await sut.handle(mockRequest())
    expect(handleSpy).toHaveBeenCalledWith(mockRequest())
  })

  test("Should return the controller's result", async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(mockAccount()))
  })

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    jest.spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(new Promise(resolve => resolve(mockServerError())))
    await sut.handle(mockRequest())
    expect(logSpy).toHaveBeenCalledWith('any_stack')
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

const mockServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}

type SutTypes = {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const controllerStub = mockController()
  const logErrorRepositoryStub = mockLogErrorRepositoryStub()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  }
}
