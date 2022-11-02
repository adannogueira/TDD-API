import { mockSurveyResult } from '$tests/domain/mocks'
import { InvalidParamError } from '$/presentation/errors'
import { forbidden, ok, serverError } from '$/presentation/helpers/http/http-helper'
import { mockLoadSurveyResult } from '$tests/presentation/mocks'
import { LoadSurveyResultController } from '$/presentation/controllers/survey-result/load-survey-result/load-survey-result-controller'
import { CheckSurveyById, LoadSurveyResult } from '$/presentation/controllers/survey-result/load-survey-result/load-survey-result-protocols'
import MockDate from 'mockdate'
import { mockCheckSurveyById } from '../mocks/mock-check-survey-by-id'

describe('LoadSurveyResultController', () => {
  beforeAll(() => MockDate.set(new Date()))
  afterAll(() => MockDate.reset())
  test('Should call CheckSurveyById with correct values', async () => {
    const { sut, checkSurveyByIdStub } = makeSut()
    const checkByIdSpy = jest.spyOn(checkSurveyByIdStub, 'checkById')
    await sut.handle(mockRequest())
    expect(checkByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should return 403 if CheckSurveyById returns false', async () => {
    const { sut, checkSurveyByIdStub } = makeSut()
    jest.spyOn(checkSurveyByIdStub, 'checkById')
      .mockResolvedValueOnce(false)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return 500 if checkSurveyById throws', async () => {
    const { sut, checkSurveyByIdStub } = makeSut()
    jest.spyOn(checkSurveyByIdStub, 'checkById')
      .mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should call LoadSurveyResult with correct values', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyResultStub, 'load')
    await sut.handle(mockRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_survey_id', 'any_account_id')
  })

  test('Should return 500 if LoadSurveyResult throws', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    jest.spyOn(loadSurveyResultStub, 'load')
      .mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(mockSurveyResult()))
  })
})

const mockRequest = (): LoadSurveyResultController.Request => ({
  surveyId: 'any_survey_id',
  accountId: 'any_account_id'
})

type SutTypes = {
  sut: LoadSurveyResultController
  checkSurveyByIdStub: CheckSurveyById
  loadSurveyResultStub: LoadSurveyResult
}

const makeSut = (): SutTypes => {
  const checkSurveyByIdStub = mockCheckSurveyById()
  const loadSurveyResultStub = mockLoadSurveyResult()
  const sut = new LoadSurveyResultController(
    checkSurveyByIdStub,
    loadSurveyResultStub
  )
  return { sut, checkSurveyByIdStub, loadSurveyResultStub }
}
