import { SurveyModel } from '../../../domain/models/survey'
import { LoadSurveyRepository } from '../../protocols/db/survey/load-survey-repository'
import { DbLoadSurvey } from './db-load-survey'

describe('DbLoadSurvey', () => {
  test('Should call LoadSurveyRepository', async () => {
    class LoadSurveyRepositoryStub implements LoadSurveyRepository {
      async loadAll (): Promise<SurveyModel[]> {
        return await Promise.resolve(makeFakeSurveys())
      }
    }
    const loadSurveyRepositoryStub = new LoadSurveyRepositoryStub()
    const loadAllSpy = jest.spyOn(loadSurveyRepositoryStub, 'loadAll')
    const sut = new DbLoadSurvey(loadSurveyRepositoryStub)
    await sut.load()
    expect(loadAllSpy).toHaveBeenCalled()
  })
})

const makeFakeSurveys = (): SurveyModel[] => ([{
  id: 'any_id',
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
}, {
  id: 'other_id',
  question: 'any_other_question',
  answers: [{
    image: 'any_other_image',
    answer: 'any_other_answer'
  }],
  date: new Date()
}])
