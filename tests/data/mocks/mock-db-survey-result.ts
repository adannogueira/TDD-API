import { LoadSurveyResultRepository } from '$/data/protocols/db/survey-result/load-survey-result-repository'
import { SaveSurveyResultRepository } from '$/data/protocols/db/survey-result/save-survey-result-repository'
import { mockSurveyResult } from '$tests/domain/mocks'

export const mockSaveSurveyResultRepositoryStub = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepoStub implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultRepository.Params): Promise<void> {
      await Promise.resolve()
    }
  }
  return new SaveSurveyResultRepoStub()
}

export const mockLoadSurveyResultRepositoryStub = (): LoadSurveyResultRepository => {
  class LoadSurveyResultRepoStub implements LoadSurveyResultRepository {
    async loadBySurveyId (surveyId: string, accountId: string): Promise<LoadSurveyResultRepository.Result> {
      return await Promise.resolve(mockSurveyResult())
    }
  }
  return new LoadSurveyResultRepoStub()
}
