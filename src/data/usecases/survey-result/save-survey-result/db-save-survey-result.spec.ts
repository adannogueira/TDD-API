import { mockLoadSurveyResultRepositoryStub, mockSaveSurveyResultRepositoryStub } from '$/data/test'
import { mockSurveyResult, mockSurveyResultData } from '$/domain/test'
import { DbSaveSurveyResult } from './db-save-survey-result'
import { SaveSurveyResultRepository } from './save-survey-result-protocols'
import MockDate from 'mockdate'
import { LoadSurveyResultRepository } from '../load-survey-result/load-survey-results-protocols'

describe('DbSaveSurveyResult Usecase', () => {
  beforeAll(() => MockDate.set(new Date()))
  afterAll(() => MockDate.reset())
  test('Should call SaveSurveyResultRepo with correct values', async () => {
    const { sut, saveSurveyResultRepoStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultRepoStub, 'save')
    const surveyResultData = mockSurveyResultData()
    await sut.save(surveyResultData)
    expect(saveSpy).toHaveBeenCalledWith(surveyResultData)
  })

  test('Should throw if SaveSurveyResultRepo throws', async () => {
    const { sut, saveSurveyResultRepoStub } = makeSut()
    jest.spyOn(saveSurveyResultRepoStub, 'save')
      .mockRejectedValueOnce(new Error())
    const promise = sut.save(mockSurveyResultData())
    await expect(promise).rejects.toThrow()
  })

  test('Should call LoadSurveyResultRepo with correct values', async () => {
    const { sut, loadSurveyResultRepoStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyResultRepoStub, 'loadBySurveyId')
    const surveyResultData = mockSurveyResultData()
    await sut.save(surveyResultData)
    expect(loadSpy).toHaveBeenCalledWith(surveyResultData.surveyId)
  })

  test('Should throw if SaveSurveyResultRepo throws', async () => {
    const { sut, loadSurveyResultRepoStub } = makeSut()
    jest.spyOn(loadSurveyResultRepoStub, 'loadBySurveyId')
      .mockRejectedValueOnce(new Error())
    const promise = sut.save(mockSurveyResultData())
    await expect(promise).rejects.toThrow()
  })

  test('Should return SurveyResult on success', async () => {
    const { sut } = makeSut()
    const surveyResultData = await sut.save(mockSurveyResultData())
    expect(surveyResultData).toEqual(mockSurveyResult())
  })
})

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepoStub: SaveSurveyResultRepository
  loadSurveyResultRepoStub: LoadSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepoStub = mockSaveSurveyResultRepositoryStub()
  const loadSurveyResultRepoStub = mockLoadSurveyResultRepositoryStub()
  const sut = new DbSaveSurveyResult(
    saveSurveyResultRepoStub,
    loadSurveyResultRepoStub
  )
  return {
    sut,
    saveSurveyResultRepoStub,
    loadSurveyResultRepoStub
  }
}
