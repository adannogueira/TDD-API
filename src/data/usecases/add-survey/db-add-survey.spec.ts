import { AddSurveyModel, AddSurveyRepository } from './add-survey-protocols'
import { DbAddSurvey } from './db-add-survey'

const makeFakeSurveyData = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }]
})

const makeAddSurveyRepoStub = (): AddSurveyRepository => {
  class AddSurveyRepoStub implements AddSurveyRepository {
    async add (data: AddSurveyModel): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new AddSurveyRepoStub()
}

interface sutTypes {
  sut: DbAddSurvey
  addSurveyRepoStub: AddSurveyRepository
}

const makeSut = (): sutTypes => {
  const addSurveyRepoStub = makeAddSurveyRepoStub()
  const sut = new DbAddSurvey(addSurveyRepoStub)
  return {
    sut,
    addSurveyRepoStub
  }
}

describe('DbAddSurvey Usecase', () => {
  test('Should call AddSurveyRepo with correct values', async () => {
    const { sut, addSurveyRepoStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepoStub, 'add')
    await sut.add(makeFakeSurveyData())
    expect(addSpy).toHaveBeenCalledWith(makeFakeSurveyData())
  })
})
