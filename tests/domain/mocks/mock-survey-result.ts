import { SurveyResultModel } from '$/domain/models/survey-result'
import { SaveSurveyResultDTO } from '$/domain/usecases/survey-result/save-survey-result'

export const mockSurveyResultData = (): SaveSurveyResultDTO => ({
  accountId: 'any_account_id',
  surveyId: 'any_survey_id',
  answer: 'any_answer',
  date: new Date()
})

export const mockSurveyResult = (): SurveyResultModel => ({
  surveyId: 'any_survey_id',
  question: 'any_question',
  answers: [{
    answer: 'any_answer',
    count: 1,
    percent: 50,
    isCurrentAccountAnswer: true
  }, {
    answer: 'other_answer',
    image: 'any_image',
    count: 1,
    percent: 50,
    isCurrentAccountAnswer: false
  }],
  date: new Date()
})
