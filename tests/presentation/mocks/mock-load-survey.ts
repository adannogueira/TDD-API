import { LoadSurvey } from '$/domain/usecases/survey/load-survey'
import { mockSurveys } from '$tests/domain/mocks'

export const mockLoadSurvey = (): LoadSurvey => {
  class LoadSurveyStub implements LoadSurvey {
    async load (): Promise<LoadSurvey.Result> {
      return await Promise.resolve(mockSurveys())
    }
  }
  return new LoadSurveyStub()
}
