import { DbSaveSurveyResult } from './db-save-survey-result'
import {
  SaveSurveyResultModel,
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
    const surveyResultData = makeFakeSurveyResultData()
    await sut.save(surveyResultData)
    expect(saveSpy).toHaveBeenCalledWith(surveyResultData)
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
    async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return await Promise.resolve(makeFakeSurveyResult())
    }
  }
  return new SaveSurveyResultRepoStub()
}

const makeFakeSurveyResultData = (): SaveSurveyResultModel => ({
  accountId: 'any_account_id',
  surveyId: 'any_survey_id',
  answer: 'any_answer',
  date: new Date()
})

const makeFakeSurveyResult = (): SurveyResultModel => Object.assign(
  {}, makeFakeSurveyResultData(), { id: 'any_id' })
