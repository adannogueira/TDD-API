import { mockLoadSurveyByIdRepositoryStub } from '$tests/data/mocks'
import { DbLoadAnswersBySurveyId } from '$/data/usecases/survey/load-answers-by-survey-id/db-load-answers-by-survey-id'
import { LoadSurveyByIdRepository } from '$/data/protocols/db/survey/load-survey-by-id-repository'

describe('DbLoadAnswersBySurveyId', () => {
  test('Should call LoadSurveyByIdRepository', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    await sut.loadAnswers('any_id')
    expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return a survey answer array on success', async () => {
    const { sut } = makeSut()
    const survey = await sut.loadAnswers('any_id')
    expect(survey).toEqual(['any_answer'])
  })

  test('Should return an empty array if LoadSurveyByIdRepository returns null', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
      .mockResolvedValueOnce(null)
    const survey = await sut.loadAnswers('any_id')
    expect(survey).toEqual([])
  })

  test('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
      .mockRejectedValueOnce(new Error())
    const promise = sut.loadAnswers('any_id')
    await expect(promise).rejects.toThrow()
  })
})

type SutTypes = {
  sut: DbLoadAnswersBySurveyId
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepositoryStub()
  const sut = new DbLoadAnswersBySurveyId(loadSurveyByIdRepositoryStub)
  return { sut, loadSurveyByIdRepositoryStub }
}
