import { Controller, HttpRequest, HttpResponse, LoadSurveyById } from './load-survey-result-protocols'

export class LoadSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {}

  async handle ({ params: { surveyId } }: HttpRequest): Promise<HttpResponse> {
    await this.loadSurveyById.loadById(surveyId)
    return null
  }
}
