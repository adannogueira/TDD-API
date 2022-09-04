import { InvalidParamError } from '../../../errors'
import { forbidden, serverError } from '../../../helpers/http/http-helper'
import { LoadSurveyById, Controller, HttpRequest, HttpResponse } from './save-survey-result-protocols'

export class SaveSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {}
  async handle ({ body: { answer }, params: { surveyId } }: HttpRequest): Promise<HttpResponse> {
    try {
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (!survey) return forbidden(new InvalidParamError('surveyId'))
      const answers = survey.answers.map(answer => answer.answer)
      if (!answers.includes(answer)) return forbidden(new InvalidParamError('answer'))
      return null
    } catch (error) {
      return serverError(error)
    }
  }
}
