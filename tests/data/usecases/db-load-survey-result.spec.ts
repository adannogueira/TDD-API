import { mockLoadSurveyResultRepositoryStub } from '$tests/data/mocks'
import { mockSurveyResult } from '$tests/domain/mocks'
import { DbLoadSurveyResult } from '$/data/usecases/survey-result/load-survey-result/db-load-survey-result'
import { LoadSurveyResultRepository } from '$/data/usecases/survey-result/load-survey-result/load-survey-results-protocols'
import MockDate from 'mockdate'

describe('DbLoadSurveyResult Usecase', () => {
  beforeAll(() => MockDate.set(new Date()))
  afterAll(() => MockDate.reset())
  test('Should call LoadSurveyResultRepo with correct values', async () => {
    const { sut, loadSurveyResultRepoStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyResultRepoStub, 'loadBySurveyId')
    await sut.load('any_survey_id', 'any_account_id')
    expect(loadSpy).toHaveBeenCalledWith('any_survey_id', 'any_account_id')
  })

  test('Should throw if LoadSurveyResultRepo throws', async () => {
    const { sut, loadSurveyResultRepoStub } = makeSut()
    jest.spyOn(loadSurveyResultRepoStub, 'loadBySurveyId')
      .mockRejectedValueOnce(new Error())
    const promise = sut.load('any_survey_id', 'any_account_id')
    await expect(promise).rejects.toThrow()
  })

  test('Should return a SurveyResultModel on success', async () => {
    const { sut } = makeSut()
    const surveyResult = await sut.load('any_survey_id', 'any_account_id')
    expect(surveyResult).toEqual(mockSurveyResult())
  })
})

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepoStub: LoadSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepoStub = mockLoadSurveyResultRepositoryStub()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepoStub)
  return { sut, loadSurveyResultRepoStub }
}
