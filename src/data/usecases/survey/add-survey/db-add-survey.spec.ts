import { mockSurveyData } from '$/domain/test'
import { AddSurveyDTO, AddSurveyRepository } from './add-survey-protocols'
import { DbAddSurvey } from './db-add-survey'
import MockDate from 'mockdate'

const makeAddSurveyRepoStub = (): AddSurveyRepository => {
  class AddSurveyRepoStub implements AddSurveyRepository {
    async add (data: AddSurveyDTO): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new AddSurveyRepoStub()
}

type SutTypes = {
  sut: DbAddSurvey
  addSurveyRepoStub: AddSurveyRepository
}

const makeSut = (): SutTypes => {
  const addSurveyRepoStub = makeAddSurveyRepoStub()
  const sut = new DbAddSurvey(addSurveyRepoStub)
  return {
    sut,
    addSurveyRepoStub
  }
}

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
    jest.spyOn(addSurveyRepoStub, 'add').mockRejectedValueOnce(new Error())
    const promise = sut.add(mockSurveyData())
    await expect(promise).rejects.toThrow()
  })
})
