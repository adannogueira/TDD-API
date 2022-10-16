import { LoadSurveyById } from '$/domain/usecases/survey/load-survey-by-id'
import { mockSurvey } from '$tests/domain/mocks'

export const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<LoadSurveyById.Result> {
      return await Promise.resolve(mockSurvey())
    }
  }
  return new LoadSurveyByIdStub()
}
