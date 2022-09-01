import { SurveyModel } from '../../../domain/models/survey'
import { LoadSurveyRepository } from '../../protocols/db/survey/load-survey-repository'
import { DbLoadSurvey } from './db-load-survey'

describe('DbLoadSurvey', () => {
  test('Should call LoadSurveyRepository', async () => {
    const { sut, loadSurveyRepositoryStub } = makeSut()
    const loadAllSpy = jest.spyOn(loadSurveyRepositoryStub, 'loadAll')
    await sut.load()
    expect(loadAllSpy).toHaveBeenCalled()
  })
})

const makeSut = (): SutTypes => {
  const loadSurveyRepositoryStub = makeLoadSurveyRepositoryStub()
  const sut = new DbLoadSurvey(loadSurveyRepositoryStub)
  return { sut, loadSurveyRepositoryStub }
}

interface SutTypes {
  sut: DbLoadSurvey
  loadSurveyRepositoryStub: LoadSurveyRepository
}
const makeLoadSurveyRepositoryStub = (): LoadSurveyRepository => {
  class LoadSurveyRepositoryStub implements LoadSurveyRepository {
    async loadAll (): Promise<SurveyModel[]> {
      return await Promise.resolve(makeFakeSurveys())
    }
  }
  return new LoadSurveyRepositoryStub()
}
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
