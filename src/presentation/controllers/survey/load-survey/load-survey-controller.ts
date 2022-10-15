import { noContent, ok, serverError } from '../../../helpers/http/http-helper'
import { Controller, HttpResponse, LoadSurvey } from '../load-survey/load-survey-controller-protocols'

export class LoadSurveyController implements Controller {
  constructor (private readonly loadSurvey: LoadSurvey) {}

  async handle ({ accountId }: LoadSurveyController.Request): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurvey.load(accountId)
      return surveys.length ? ok(surveys) : noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace LoadSurveyController {
  export type Request = {
    accountId: string
  }
}
