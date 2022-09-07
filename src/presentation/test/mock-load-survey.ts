import { SurveyModel } from '$/domain/models/survey'
import { LoadSurvey } from '$/domain/usecases/survey/load-survey'
import { mockSurveys } from '$/domain/test'

export const mockLoadSurvey = (): LoadSurvey => {
  class LoadSurveyStub implements LoadSurvey {
    async load (): Promise<SurveyModel[]> {
      return await Promise.resolve(mockSurveys())
    }
  }
  return new LoadSurveyStub()
}