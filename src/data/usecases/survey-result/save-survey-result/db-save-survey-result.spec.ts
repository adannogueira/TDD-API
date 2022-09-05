import { mockSurveyResult, mockSurveyResultData } from '$/domain/test'
import { DbSaveSurveyResult } from './db-save-survey-result'
import {
  SaveSurveyResultDTO,
  SaveSurveyResultRepository,
  SurveyResultModel
} from './save-survey-result-protocols'
import MockDate from 'mockdate'

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
    jest.spyOn(saveSurveyResultRepoStub, 'save').mockRejectedValueOnce(new Error())
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
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepoStub = makeSaveSurveyResultRepoStub()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepoStub)
  return {
    sut,
    saveSurveyResultRepoStub
  }
}

const makeSaveSurveyResultRepoStub = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepoStub implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultDTO): Promise<SurveyResultModel> {
      return await Promise.resolve(mockSurveyResult())
    }
  }
  return new SaveSurveyResultRepoStub()
}
