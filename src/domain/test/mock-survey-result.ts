import { SurveyResultModel } from '$/domain/models/survey-result'
import { SaveSurveyResultDTO } from '$/domain/usecases/survey-result/save-survey-result'

export const mockSurveyResultData = (): SaveSurveyResultDTO => ({
  accountId: 'any_account_id',
  surveyId: 'any_survey_id',
  answer: 'any_answer',
  date: new Date()
})

export const mockSurveyResult = (): SurveyResultModel => Object.assign(
  {}, mockSurveyResultData(), { id: 'any_id' })
