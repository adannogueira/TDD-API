import { Router } from 'express'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeLoginController } from '../factories/controllers/user/login/login-controller-factory'
import { makeRefreshController } from '../factories/controllers/user/refresh/refresh-controller-factory'
import { makeSignUpController } from '../factories/controllers/user/signup/signup-controller-factory'
import { makeRefreshMiddleware } from '../factories/middlewares/refresh-middleware-factory'

export default (router: Router): void => {
  const refreshValidation = adaptMiddleware(makeRefreshMiddleware())
  router.post('/signup', adaptRoute(makeSignUpController()))
  router.post('/login', adaptRoute(makeLoginController()))
  router.post('/refresh', refreshValidation, adaptRoute(makeRefreshController()))
}
