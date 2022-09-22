
import { mockSurveys } from '$/domain/test'
import { noContent, ok, serverError } from '$/presentation/helpers/http/http-helper'
import { mockLoadSurvey } from '$/presentation/test'
import { LoadSurveyController } from './load-survey-controller'
import { LoadSurvey, HttpRequest } from './load-survey-controller-protocols'
import MockDate from 'mockdate'

describe('LoadSurveyController', () => {
  beforeAll(() => MockDate.set(new Date()))
  afterAll(() => MockDate.reset())
  test('Should call LoadSurvey with correct values', async () => {
    const { sut, loadSurveyStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyStub, 'load')
    await sut.handle(mockRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(mockSurveys()))
  })

  test('Should return 204 if LoadSurvey return empty', async () => {
    const { sut, loadSurveyStub } = makeSut()
    jest.spyOn(loadSurveyStub, 'load')
      .mockResolvedValueOnce([])
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(noContent())
  })

  test('Should return 500 if LoadSurvey throws', async () => {
    const { sut, loadSurveyStub } = makeSut()
    jest.spyOn(loadSurveyStub, 'load')
      .mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})

type SutTypes = {
  sut: LoadSurveyController
  loadSurveyStub: LoadSurvey
}

const makeSut = (): SutTypes => {
  const loadSurveyStub = mockLoadSurvey()
  const sut = new LoadSurveyController(loadSurveyStub)
  return { sut, loadSurveyStub }
}

const mockRequest = (): HttpRequest => ({
  accountId: 'any_id'
})
