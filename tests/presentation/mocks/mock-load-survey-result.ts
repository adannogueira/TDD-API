import { mockSurveyResult } from '$tests/domain/mocks'
import { LoadSurveyResult } from '$/domain/usecases/survey-result/load-survey-result'

export const mockLoadSurveyResult = (): LoadSurveyResult => {
  class LoadSurveyResultStub implements LoadSurveyResult {
    async load (surveyId: string, accountId: string): Promise<LoadSurveyResult.Result> {
      return await Promise.resolve(mockSurveyResult())
    }
  }
  return new LoadSurveyResultStub()
}
