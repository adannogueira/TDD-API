import { InvalidParamError } from '$/presentation/errors'
import { forbidden } from '$/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse, LoadSurveyById } from './load-survey-result-protocols'

export class LoadSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {}

  async handle ({ params: { surveyId } }: HttpRequest): Promise<HttpResponse> {
    const survey = await this.loadSurveyById.loadById(surveyId)
    if (!survey) return forbidden(new InvalidParamError('surveyId'))
    return null
  }
}
