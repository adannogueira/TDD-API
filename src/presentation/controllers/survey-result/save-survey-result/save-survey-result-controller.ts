import { InvalidParamError } from '$/presentation/errors'
import { forbidden, ok, serverError } from '$/presentation/helpers/http/http-helper'
import {
  Controller,
  HttpResponse,
  LoadAnswersBySurveyId,
  SaveSurveyResult
} from './save-survey-result-protocols'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadAnswersBySurveyId: LoadAnswersBySurveyId,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  async handle ({
    answer,
    accountId,
    surveyId
  }: SaveSurveyResultController.Request): Promise<HttpResponse> {
    try {
      const answers = await this.loadAnswersBySurveyId.loadAnswers(surveyId)
      if (!answers.length) return forbidden(new InvalidParamError('surveyId'))
      if (!answers.includes(answer)) return forbidden(new InvalidParamError('answer'))
      const surveyResult = await this.saveSurveyResult.save({
        accountId,
        surveyId,
        answer,
        date: new Date()
      })
      return ok(surveyResult)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace SaveSurveyResultController {
  export type Request = {
    answer: string
    accountId: string
    surveyId: string
  }
}
