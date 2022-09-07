import {
  accountSchema,
  addSurveySchema,
  errorSchema,
  passwordLoginSchema,
  saveSurveyResultSchema,
  signupSchema,
  surveyAnswerSchema,
  surveyResultSchema,
  surveySchema,
  surveysSchema
} from './schemas/'

export const schemas = {
  account: accountSchema,
  addSurvey: addSurveySchema,
  error: errorSchema,
  passwordLogin: passwordLoginSchema,
  saveSurveyResult: saveSurveyResultSchema,
  signup: signupSchema,
  surveyAnswer: surveyAnswerSchema,
  survey: surveySchema,
  surveyResult: surveyResultSchema,
  surveys: surveysSchema
}
