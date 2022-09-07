import { badRequest, forbidden, serverError, unauthorized } from './components'
import { passwordLoginPath, signupPath, surveyPath } from './paths'
import {
  accountSchema,
  authorizationSchema,
  errorSchema,
  passwordLoginSchema,
  signupSchema,
  surveyAnswerSchema,
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
    '/surveys': surveyPath
  },
  schemas: {
    account: accountSchema,
    error: errorSchema,
    passwordLogin: passwordLoginSchema,
    signup: signupSchema,
    surveyAnswer: surveyAnswerSchema,
    survey: surveySchema,
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
