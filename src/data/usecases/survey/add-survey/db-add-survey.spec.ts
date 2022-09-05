import { AddSurveyDTO, AddSurveyRepository } from './add-survey-protocols'
import { DbAddSurvey } from './db-add-survey'
import MockDate from 'mockdate'

const makeFakeSurveyData = (): AddSurveyDTO => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
})

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
    await sut.add(makeFakeSurveyData())
    expect(addSpy).toHaveBeenCalledWith(makeFakeSurveyData())
  })

  test('Should throw if AddSurveyRepo throws', async () => {
    const { sut, addSurveyRepoStub } = makeSut()
    jest.spyOn(addSurveyRepoStub, 'add').mockRejectedValueOnce(new Error())
    const promise = sut.add(makeFakeSurveyData())
    await expect(promise).rejects.toThrow()
  })
})
