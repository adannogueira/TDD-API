import { LoadSurveyById } from '$/data/usecases/survey/load-survey-by-id/load-survey-by-id-protocols'

export interface LoadSurveyByIdRepository {
  loadById: (id: string) => Promise <LoadSurveyByIdRepository.Result>
}

export namespace LoadSurveyByIdRepository {
  export type Result = LoadSurveyById.Result
}
