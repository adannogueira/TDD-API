import { LoadAnswersBySurveyId, LoadSurveyByIdRepository } from './load-answers-by-survey-id-protocols'

export class DbLoadAnswersBySurveyId implements LoadAnswersBySurveyId {
  constructor (private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository) {}

  async loadAnswers (id: string): Promise<LoadAnswersBySurveyId.Result> {
    const survey = await this.loadSurveyByIdRepository.loadById(id)
    return survey?.answers.map(answer => answer.answer) || []
  }
}
