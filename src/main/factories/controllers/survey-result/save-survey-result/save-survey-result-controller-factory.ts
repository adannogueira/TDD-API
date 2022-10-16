import { makeLogControllerDecorator } from '$/main/factories/decorators/log-controller-decorator-factory'
import { makeDbLoadAnswersBySurveyId } from '$/main/factories/usecases/survey/load-answers-by-survey-id/db-load-answers-by-survey-id-factory'
import { makeDbSaveSurveyResult } from '$/main/factories/usecases/survey-result/save-survey-result/db-save-survey-result-factory'
import { SaveSurveyResultController } from '$/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller'
import { Controller } from '$/presentation/protocols'

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(
    makeDbLoadAnswersBySurveyId(),
    makeDbSaveSurveyResult()
  )
  return makeLogControllerDecorator(controller)
}
