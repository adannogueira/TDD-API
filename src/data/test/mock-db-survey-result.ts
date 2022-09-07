import { SaveSurveyResultRepository } from '$/data/protocols/db/survey-result/save-survey-result-repository'
import { SaveSurveyResultDTO } from '$/data/usecases/survey-result/save-survey-result/save-survey-result-protocols'
import { SurveyResultModel } from '$/domain/models/survey-result'
import { mockSurveyResult } from '$/domain/test'

export const mockSaveSurveyResultRepositoryStub = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepoStub implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultDTO): Promise<SurveyResultModel> {
      return await Promise.resolve(mockSurveyResult())
    }
  }
  return new SaveSurveyResultRepoStub()
}