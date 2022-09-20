import { SurveyResultModel } from '$/domain/models/survey-result'

export type SaveSurveyResultDTO = {
  surveyId: string
  accountId: string
  answer: string
  date: Date
}

export interface SaveSurveyResult {
  save: (surveyResult: SaveSurveyResultDTO) => Promise<SurveyResultModel>
}
