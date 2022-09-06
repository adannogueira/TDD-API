import { AddSurveyDTO } from '$/domain/usecases/survey/add-survey'

export interface AddSurveyRepository {
  add: (surveyData: AddSurveyDTO) => Promise <void>
}
