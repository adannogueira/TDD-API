import { InvalidParamError } from '../../../errors'
import { forbidden } from '../../../helpers/http/http-helper'
import { LoadSurveyById, Controller, HttpRequest, HttpResponse } from './save-survey-result-protocols'

export class SaveSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const survey = await this.loadSurveyById.loadById(httpRequest.params.surveyId)
    if (!survey) return forbidden(new InvalidParamError('surveyId'))
    return null
  }
}
