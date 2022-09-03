import { DbLoadSurvey } from '../../../../../data/usecases/load-survey/db-load-survey'
import { LoadSurvey } from '../../../../../domain/usecases/load-survey'
import { SurveyMongoRepository } from '../../../../../infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbLoadSurvey = (): LoadSurvey => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurvey(surveyMongoRepository)
}