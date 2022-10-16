import {
  LoadSurveyResult,
  LoadSurveyResultRepository
} from './load-survey-results-protocols'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) {}

  async load (surveyId: string, accountId: string): Promise<LoadSurveyResult.Result> {
    const surveyResult = await this.loadSurveyResultRepository
      .loadBySurveyId(surveyId, accountId)
    return surveyResult
  }
}
