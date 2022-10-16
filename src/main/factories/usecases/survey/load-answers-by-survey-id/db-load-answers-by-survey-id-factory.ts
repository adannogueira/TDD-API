import { DbLoadAnswersBySurveyId } from '$/data/usecases/survey/load-answers-by-survey-id/db-load-answers-by-survey-id'
import { LoadAnswersBySurveyId } from '$/domain/usecases/survey/load-answers-by-survey-id'
import { SurveyMongoRepository } from '$/infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbLoadAnswersBySurveyId = (): LoadAnswersBySurveyId => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadAnswersBySurveyId(surveyMongoRepository)
}
