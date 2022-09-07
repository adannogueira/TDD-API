import { badRequest, forbidden, serverError, unauthorized } from './components'
import { passwordLoginPath, signupPath, surveyPath, surveyResultPath } from './paths'
import {
  accountSchema,
  addSurveySchema,
  authorizationSchema,
  errorSchema,
  passwordLoginSchema,
  saveSurveyResultSchema,
  signupSchema,
  surveyAnswerSchema,
  surveyResultSchema,
  surveySchema,
  surveysSchema
} from './schemas'

export default {
  openapi: '3.0.0',
  info: {
    title: 'TDD API',
    description: 'API construída usando TDD e técnicas de clean code',
    version: '1.0.0'
  },
  license: {
    name: 'MIT',
    url: 'https://opensource.org/licenses/MIT'
  },
  servers: [{
    url: '/api'
  }],
  tags: [{
    name: 'Login'
  }, {
    name: 'Surveys'
  }],
  paths: {
    '/login': passwordLoginPath,
    '/signup': signupPath,
    '/surveys': surveyPath,
    '/surveys/{surveyId}/results': surveyResultPath
  },
  schemas: {
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
  },
  components: {
    securitySchemes: {
      authorization: authorizationSchema
    },
    badRequest,
    forbidden,
    unauthorized,
    serverError
  }
}
