import { mockLoadSurveyResultRepositoryStub } from '$/data/test'
import { DbLoadSurveyResult } from './db-load-survey-result'
import { LoadSurveyResultRepository } from './load-survey-results-protocols'

describe('DbLoadSurveyResult Usecase', () => {
  test('Should call LoadSurveyResultRepo with correct values', async () => {
    const { sut, loadSurveyResultRepoStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyResultRepoStub, 'loadBySurveyId')
    await sut.load('any_survey_id')
    expect(loadSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should throw if LoadSurveyResultRepo throws', async () => {
    const { sut, loadSurveyResultRepoStub } = makeSut()
    jest.spyOn(loadSurveyResultRepoStub, 'loadBySurveyId')
      .mockRejectedValueOnce(new Error())
    const promise = sut.load('any_survey_id')
    await expect(promise).rejects.toThrow()
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
