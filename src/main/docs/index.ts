import { loginPath } from './paths/login-path'
import { accountSchema } from './schemas/account-schema'
import { passwordLoginSchema } from './schemas/password-login-schema'

export default {
  openapi: '3.0.0',
  info: {
    title: 'TDD API',
    description: 'API construída usando TDD e técnicas de clean code',
    version: '1.0.0'
  },
  servers: [{
    url: '/api'
  }],
  tags: [{
    name: 'PasswordLogin'
  }],
  paths: {
    '/login': loginPath
  },
  schemas: {
    account: accountSchema,
    passwordLogin: passwordLoginSchema
  }
}
