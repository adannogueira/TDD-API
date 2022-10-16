import { InvalidParamError } from '$/presentation/errors'
import { forbidden, ok, serverError } from '$/presentation/helpers/http/http-helper'
import {
  Controller,
  HttpResponse,
  CheckSurveyById,
  LoadSurveyResult
} from './load-survey-result-protocols'

export class LoadSurveyResultController implements Controller {
  constructor (
    private readonly checkSurveyById: CheckSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult
  ) {}

  async handle ({ surveyId, accountId }: LoadSurveyResultController.Request): Promise<HttpResponse> {
    try {
      const survey = await this.checkSurveyById.checkById(surveyId)
      if (!survey) return forbidden(new InvalidParamError('surveyId'))
      const surveyResult = await this.loadSurveyResult.load(surveyId, accountId)
      return ok(surveyResult)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace LoadSurveyResultController {
  export type Request = {
    surveyId: string
    accountId: string
  }
}
