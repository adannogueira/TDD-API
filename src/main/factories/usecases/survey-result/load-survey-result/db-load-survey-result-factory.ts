import { DbLoadSurveyResult } from '$/data/usecases/survey-result/load-survey-result/db-load-survey-result'
import { LoadSurveyResult } from '$/domain/usecases/survey-result/load-survey-result'
import { SurveyResultMongoRepository } from '$/infra/db/mongodb/survey-result/survey-result-mongo-repository'

export const makeDbLoadSurveyResult = (): LoadSurveyResult => {
  const surveyResultMongoRepository = new SurveyResultMongoRepository()
  return new DbLoadSurveyResult(surveyResultMongoRepository)
}
