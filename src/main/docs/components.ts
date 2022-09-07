import { badRequest, forbidden, serverError, unauthorized } from './components/'
import { authorizationSchema, refreshSchema } from './schemas/'

export const components = {
  securitySchemes: {
    authorization: authorizationSchema,
    refresh: refreshSchema
  },
  badRequest,
  forbidden,
  unauthorized,
  serverError
}
