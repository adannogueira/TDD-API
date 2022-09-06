import { SurveyModel } from '$/domain/models/survey'
import { LoadSurveyById } from '$/domain/usecases/survey/load-survey-by-id'
import { mockSurvey } from '$/domain/test'

export const mmockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel> {
      return await Promise.resolve(mockSurvey())
    }
  }
  return new LoadSurveyByIdStub()
}
