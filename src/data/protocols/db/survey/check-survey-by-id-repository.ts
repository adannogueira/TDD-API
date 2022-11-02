import { CheckSurveyById } from '$/data/usecases/survey/check-survey-by-id/check-survey-by-id-protocols'

export interface CheckSurveyByIdRepository {
  checkById: (id: string) => Promise <CheckSurveyByIdRepository.Result>
}

export namespace CheckSurveyByIdRepository {
  export type Result = CheckSurveyById.Result
}
