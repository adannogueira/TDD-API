import { mockAddSurveyRepositoryStub } from '$tests/data/mocks'
import { mockSurveyData } from '$/../tests/domain/test'
import { AddSurveyRepository } from '$/data/usecases/survey/add-survey/add-survey-protocols'
import { DbAddSurvey } from '$/data/usecases/survey/add-survey/db-add-survey'
import MockDate from 'mockdate'

describe('DbAddSurvey Usecase', () => {
  beforeAll(() => MockDate.set(new Date()))
  afterAll(() => MockDate.reset())
  test('Should call AddSurveyRepo with correct values', async () => {
    const { sut, addSurveyRepoStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepoStub, 'add')
    await sut.add(mockSurveyData())
    expect(addSpy).toHaveBeenCalledWith(mockSurveyData())
  })

  test('Should throw if AddSurveyRepo throws', async () => {
    const { sut, addSurveyRepoStub } = makeSut()
    jest.spyOn(addSurveyRepoStub, 'add')
      .mockRejectedValueOnce(new Error())
    const promise = sut.add(mockSurveyData())
    await expect(promise).rejects.toThrow()
  })
})

type SutTypes = {
  sut: DbAddSurvey
  addSurveyRepoStub: AddSurveyRepository
}

const makeSut = (): SutTypes => {
  const addSurveyRepoStub = mockAddSurveyRepositoryStub()
  const sut = new DbAddSurvey(addSurveyRepoStub)
  return {
    sut,
    addSurveyRepoStub
  }
}
