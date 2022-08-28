
import { LoadSurveyController } from './load-survey-controller'
import { LoadSurvey, SurveyModel } from './load-survey-controller-protocols'
import { ok } from '../../../helpers/http/http-helper'
import MockDate from 'mockdate'

describe('LoadSurveyController', () => {
  beforeAll(() => MockDate.set(new Date()))
  afterAll(() => MockDate.reset())
  test('Should call LoadSurvey', async () => {
    const { sut, loadSurveyStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyStub, 'load')
    await sut.handle({})
    expect(loadSpy).toHaveBeenCalled()
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(ok(makeFakeSurveys()))
  })
})

const makeLoadSurvey = (): LoadSurvey => {
  class LoadSurveyStub implements LoadSurvey {
    async load (): Promise<SurveyModel[]> {
      return await Promise.resolve(makeFakeSurveys())
    }
  }
  return new LoadSurveyStub()
}

const makeSut = (): SutTypes => {
  const loadSurveyStub = makeLoadSurvey()
  const sut = new LoadSurveyController(loadSurveyStub)
  return { sut, loadSurveyStub }
}

interface SutTypes {
  sut: LoadSurveyController
  loadSurveyStub: LoadSurvey
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