import { LoadAnswersBySurveyId } from '$/domain/usecases/survey/load-answers-by-survey-id'

export const mockLoadAnswersBySurveyId = (): LoadAnswersBySurveyId => {
  class LoadAnswersBySurveyIdStub implements LoadAnswersBySurveyId {
    async loadAnswers (id: string): Promise<LoadAnswersBySurveyId.Result> {
      return await Promise.resolve(['any_answer'])
    }
  }
  return new LoadAnswersBySurveyIdStub()
}
