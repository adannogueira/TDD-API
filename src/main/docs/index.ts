import { components } from './components'
import { paths } from './paths'
import { schemas } from './schemas'

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
  components,
  paths,
  schemas
}
