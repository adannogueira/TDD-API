import { mockSurveys } from '$/domain/test'
import { DbLoadSurvey } from './db-load-survey'
import { LoadSurveyRepository, SurveyModel } from './load-survey-protocols'
import MockDate from 'mockdate'

describe('DbLoadSurvey', () => {
  beforeAll(() => MockDate.set(new Date()))
  afterAll(() => MockDate.reset())
  test('Should call LoadSurveyRepository', async () => {
    const { sut, loadSurveyRepositoryStub } = makeSut()
    const loadAllSpy = jest.spyOn(loadSurveyRepositoryStub, 'loadAll')
    await sut.load()
    expect(loadAllSpy).toHaveBeenCalled()
  })

  test('Should return an array of surveys on success', async () => {
    const { sut } = makeSut()
    const surveys = await sut.load()
    expect(surveys).toStrictEqual(mockSurveys())
  })

  test('Should throw if LoadSurveyRepository throws', async () => {
    const { sut, loadSurveyRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyRepositoryStub, 'loadAll').mockRejectedValueOnce(new Error())
    const promise = sut.load()
    await expect(promise).rejects.toThrow()
  })
})

const makeSut = (): SutTypes => {
  const loadSurveyRepositoryStub = makeLoadSurveyRepositoryStub()
  const sut = new DbLoadSurvey(loadSurveyRepositoryStub)
  return { sut, loadSurveyRepositoryStub }
}

type SutTypes = {
  sut: DbLoadSurvey
  loadSurveyRepositoryStub: LoadSurveyRepository
}
const makeLoadSurveyRepositoryStub = (): LoadSurveyRepository => {
  class LoadSurveyRepositoryStub implements LoadSurveyRepository {
    async loadAll (): Promise<SurveyModel[]> {
      return await Promise.resolve(mockSurveys())
    }
  }
  return new LoadSurveyRepositoryStub()
}
