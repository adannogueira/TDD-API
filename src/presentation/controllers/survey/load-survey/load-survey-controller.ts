import { noContent, ok, serverError } from '../../../helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse, LoadSurvey } from '../load-survey/load-survey-controller-protocols'

export class LoadSurveyController implements Controller {
  constructor (private readonly loadSurvey: LoadSurvey) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurvey.load()
      return surveys.length ? ok(surveys) : noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
