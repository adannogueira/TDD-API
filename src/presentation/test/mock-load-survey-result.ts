import { SurveyResultModel } from '$/domain/models/survey-result'
import { mockSurveyResult } from '$/domain/test'
import { LoadSurveyResult } from '$/domain/usecases/survey-result/load-survey-result'

export const mockLoadSurveyResult = (): LoadSurveyResult => {
  class LoadSurveyResultStub implements LoadSurveyResult {
    async load (surveyId: string): Promise<SurveyResultModel> {
      return await Promise.resolve(mockSurveyResult())
    }
  }
  return new LoadSurveyResultStub()
}
