import { AddSurvey, AddSurveyModel } from '$/domain/usecases/survey/add-survey'
import { AddSurveyRepository } from './add-survey-protocols'

export class DbAddSurvey implements AddSurvey {
  constructor (private readonly addSurveyRepository: AddSurveyRepository) {}

  async add (survey: AddSurveyModel): Promise<void> {
    await this.addSurveyRepository.add(survey)
    return null
  }
}
