import { badRequest, forbidden, serverError, unauthorized } from './components/'
import { authorizationSchema } from './schemas/'

export const components = {
  securitySchemes: {
    authorization: authorizationSchema
  },
  badRequest,
  forbidden,
  unauthorized,
  serverError
}
