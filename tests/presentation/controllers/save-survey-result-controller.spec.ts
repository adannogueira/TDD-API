import { mockSurveyResult } from '$tests/domain/mocks'
import { InvalidParamError } from '$/presentation/errors'
import { forbidden, ok, serverError } from '$/presentation/helpers/http/http-helper'
import { mockLoadAnswersBySurveyId, mockSaveSurveyResult } from '$tests/presentation/mocks'
import { SaveSurveyResultController } from '$/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller'
import {
  LoadAnswersBySurveyId,
  SaveSurveyResult
} from '$/presentation/controllers/survey-result/save-survey-result/save-survey-result-protocols'
import MockDate from 'mockdate'

describe('SaveSurveyResultController', () => {
  beforeAll(() => MockDate.set(new Date()))
  afterAll(() => MockDate.reset())
  test('Should call LoadAnswersBySurveyId with correct values', async () => {
    const { sut, loadAnswersBySurveyIdStub } = makeSut()
    const loadSpy = jest.spyOn(loadAnswersBySurveyIdStub, 'loadAnswers')
    await sut.handle(mockRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return 403 if LoadAnswersBySurveyId returns and empty array', async () => {
    const { sut, loadAnswersBySurveyIdStub } = makeSut()
    jest.spyOn(loadAnswersBySurveyIdStub, 'loadAnswers')
      .mockResolvedValueOnce([])
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return 500 if LoadAnswersBySurveyId throws', async () => {
    const { sut, loadAnswersBySurveyIdStub } = makeSut()
    jest.spyOn(loadAnswersBySurveyIdStub, 'loadAnswers')
      .mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({
      answer: 'invalid_answer',
      surveyId: 'any_id',
      accountId: 'any_account_id'
    })
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })

  test('Should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
    await sut.handle(mockRequest())
    expect(saveSpy).toHaveBeenCalledWith({
      surveyId: 'any_id',
      accountId: 'any_account_id',
      answer: 'any_answer',
      date: new Date()
    })
  })

  test('Should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    jest.spyOn(saveSurveyResultStub, 'save')
      .mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 ons success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(mockSurveyResult()))
  })
})

type SutTypes = {
  sut: SaveSurveyResultController
  loadAnswersBySurveyIdStub: LoadAnswersBySurveyId
  saveSurveyResultStub: SaveSurveyResult
}

const makeSut = (): SutTypes => {
  const loadAnswersBySurveyIdStub = mockLoadAnswersBySurveyId()
  const saveSurveyResultStub = mockSaveSurveyResult()
  const sut = new SaveSurveyResultController(
    loadAnswersBySurveyIdStub,
    saveSurveyResultStub
  )
  return { sut, loadAnswersBySurveyIdStub, saveSurveyResultStub }
}

const mockRequest = (): SaveSurveyResultController.Request => ({
  surveyId: 'any_id',
  answer: 'any_answer',
  accountId: 'any_account_id'
})
