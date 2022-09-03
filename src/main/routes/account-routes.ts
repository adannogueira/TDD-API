import { adaptMiddleware } from '$/main/adapters/express-middleware-adapter'
import { adaptRoute } from '$/main/adapters/express-route-adapter'
import { makeLoginController } from '$/main/factories/controllers/user/login/login-controller-factory'
import { makeRefreshController } from '$/main/factories/controllers/user/refresh/refresh-controller-factory'
import { makeSignUpController } from '$/main/factories/controllers/user/signup/signup-controller-factory'
import { makeRefreshMiddleware } from '$/main/factories/middlewares/refresh-middleware-factory'
import { Router } from 'express'

export default (router: Router): void => {
  const refreshValidation = adaptMiddleware(makeRefreshMiddleware())
  router.post('/signup', adaptRoute(makeSignUpController()))
  router.post('/login', adaptRoute(makeLoginController()))
  router.post('/refresh', refreshValidation, adaptRoute(makeRefreshController()))
}
