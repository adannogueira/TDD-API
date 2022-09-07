import { badRequest, serverError, unauthorized } from './components'
import { passwordLoginPath } from './paths'
import { accountSchema, errorSchema, passwordLoginSchema } from './schemas'

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
    name: 'PasswordLogin'
  }],
  paths: {
    '/login': passwordLoginPath
  },
  schemas: {
    account: accountSchema,
    passwordLogin: passwordLoginSchema,
    error: errorSchema
  },
  components: {
    badRequest,
    unauthorized,
    serverError
  }
}
