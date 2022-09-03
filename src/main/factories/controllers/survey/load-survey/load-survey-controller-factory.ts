import { LoadSurveyController } from '../../../../../presentation/controllers/survey/load-survey/load-survey-controller'
import { Controller } from '../../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'
import { makeDbLoadSurvey } from '../../../usecases/survey/load-survey/db-load-survey-factory'

export const makeLoadSurveyController = (): Controller => {
  const controller = new LoadSurveyController(makeDbLoadSurvey())
  return makeLogControllerDecorator(controller)
}
