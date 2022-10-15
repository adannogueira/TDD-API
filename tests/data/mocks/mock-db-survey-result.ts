import { LoadSurveyResultRepository } from '$/data/protocols/db/survey-result/load-survey-result-repository'
import { SaveSurveyResultRepository } from '$/data/protocols/db/survey-result/save-survey-result-repository'
import { SaveSurveyResultDTO } from '$/data/usecases/survey-result/save-survey-result/save-survey-result-protocols'
import { SurveyResultModel } from '$/domain/models/survey-result'
import { mockSurveyResult } from '$/domain/test'

export const mockSaveSurveyResultRepositoryStub = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepoStub implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultDTO): Promise<void> {
      await Promise.resolve()
    }
  }
  return new SaveSurveyResultRepoStub()
}

export const mockLoadSurveyResultRepositoryStub = (): LoadSurveyResultRepository => {
  class LoadSurveyResultRepoStub implements LoadSurveyResultRepository {
    async loadBySurveyId (surveyId: string, accountId: string): Promise<SurveyResultModel> {
      return await Promise.resolve(mockSurveyResult())
    }
  }
  return new LoadSurveyResultRepoStub()
}
