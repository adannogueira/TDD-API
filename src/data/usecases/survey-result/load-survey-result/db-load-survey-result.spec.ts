import { mockSurveyResult } from '$/domain/test'
import { DbLoadSurveyResult } from './db-load-survey-result'
import { LoadSurveyResultRepository, SurveyResultModel } from './load-survey-results-protocols'

describe('DbLoadSurveyResult Usecase', () => {
  test('Should call LoadSurveyResultRepo with correct values', async () => {
    class LoadSurveyResultRepo implements LoadSurveyResultRepository {
      async loadBySurveyId (surveyId: string): Promise<SurveyResultModel> {
        return await Promise.resolve(mockSurveyResult())
      }
    }
    const loadSurveyResultRepoStub = new LoadSurveyResultRepo()
    const sut = new DbLoadSurveyResult(loadSurveyResultRepoStub)
    const loadSpy = jest.spyOn(loadSurveyResultRepoStub, 'loadBySurveyId')
    await sut.load('any_survey_id')
    expect(loadSpy).toHaveBeenCalledWith('any_survey_id')
  })
})
