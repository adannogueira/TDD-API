import { SurveyResultModel } from '$/domain/models/survey-result'
import { SaveSurveyResultDTO } from '$/domain/usecases/survey-result/save-survey-result'

export interface SaveSurveyResultRepository {
  save: (data: SaveSurveyResultDTO) => Promise <SurveyResultModel>
}
