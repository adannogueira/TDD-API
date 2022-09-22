import { LoadSurveyRepository, SurveyModel, LoadSurvey } from './load-survey-protocols'

export class DbLoadSurvey implements LoadSurvey {
  constructor (private readonly loadSurveyRepository: LoadSurveyRepository) {}

  async load (accountId: string): Promise<SurveyModel[]> {
    const surveys = await this.loadSurveyRepository.loadAll(accountId)
    return surveys
  }
}
