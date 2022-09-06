import { SurveyResultModel } from '$/domain/models/survey-result'
import { SaveSurveyResult, SaveSurveyResultDTO } from '$/domain/usecases/survey-result/save-survey-result'
import { mockSurveyResult } from '$/domain/test'

export const mockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResultDTO): Promise<SurveyResultModel> {
      return await Promise.resolve(mockSurveyResult())
    }
  }
  return new SaveSurveyResultStub()
}
