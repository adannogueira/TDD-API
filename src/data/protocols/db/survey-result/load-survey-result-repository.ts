import { LoadSurveyResult } from '$/data/usecases/survey-result/load-survey-result/load-survey-results-protocols'

export interface LoadSurveyResultRepository {
  loadBySurveyId: (surveyId: string, accountId: string) => Promise <LoadSurveyResultRepository.Result>
}

export namespace LoadSurveyResultRepository {
  export type Result = LoadSurveyResult.Result
}
