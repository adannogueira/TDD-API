
import { LoadSurveyController } from './load-survey-controller'
import { LoadSurvey, SurveyModel } from './load-survey-controller-protocols'
import MockDate from 'mockdate'

describe('LoadSurveyController', () => {
  beforeAll(() => MockDate.set(new Date()))
  afterAll(() => MockDate.reset())
  test('Should call LoadSurvey', async () => {
    class LoadSurveysStub implements LoadSurvey {
      async load (): Promise<SurveyModel[]> {
        return await Promise.resolve(makeFakeSurveys())
      }
    }
    const loadSurveyStub = new LoadSurveysStub()
    const loadSpy = jest.spyOn(loadSurveyStub, 'load')
    const sut = new LoadSurveyController(loadSurveyStub)
    await sut.handle({})
    expect(loadSpy).toHaveBeenCalled()
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
