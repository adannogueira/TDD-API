import { CheckSurveyById, CheckSurveyByIdRepository } from './check-survey-by-id-protocols'

export class DbCheckSurveyById implements CheckSurveyById {
  constructor (private readonly checkSurveyByIdRepository: CheckSurveyByIdRepository) {}

  async checkById (id: string): Promise<CheckSurveyById.Result> {
    const survey = await this.checkSurveyByIdRepository.checkById(id)
    return survey
  }
}
