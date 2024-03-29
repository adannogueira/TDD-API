import { adaptRoute } from '$/main/adapters/express-route-adapter'
import { makeAddSurveyController } from '$/main/factories/controllers/survey/add-survey/add-survey-controller-factory'
import { makeLoadSurveyController } from '$/main/factories/controllers/survey/load-survey/load-survey-controller-factory'
import { adminAuth } from '$/main/middlewares/admin-auth'
import { userAuth } from '$/main/middlewares/user-auth'
import { Router } from 'express'

export default (router: Router): void => {
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
  router.get('/surveys', userAuth, adaptRoute(makeLoadSurveyController()))
}
