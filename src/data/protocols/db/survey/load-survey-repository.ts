import { LoadSurvey } from '$/domain/usecases/survey/load-survey'

export interface LoadSurveyRepository {
  loadAll: (accountId: string) => Promise <LoadSurveyRepository.Result>
}

export namespace LoadSurveyRepository {
  export type Result = LoadSurvey.Result
}
