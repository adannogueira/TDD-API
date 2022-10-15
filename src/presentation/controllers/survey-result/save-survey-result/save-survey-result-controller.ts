import { InvalidParamError } from '$/presentation/errors'
import { forbidden, ok, serverError } from '$/presentation/helpers/http/http-helper'
import {
  Controller,
  HttpResponse,
  LoadSurveyById,
  SaveSurveyResult
} from './save-survey-result-protocols'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  async handle ({
    answer,
    accountId,
    surveyId
  }: SaveSurveyResultController.Request): Promise<HttpResponse> {
    try {
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (!survey) return forbidden(new InvalidParamError('surveyId'))
      const answers = survey.answers.map(answer => answer.answer)
      if (!answers.includes(answer)) return forbidden(new InvalidParamError('answer'))
      const surveyResult = await this.saveSurveyResult.save({
        accountId,
        surveyId: survey.id,
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
