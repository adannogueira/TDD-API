import { mockCheckSurveyByIdRepositoryStub } from '$tests/data/mocks'
import { CheckSurveyByIdRepository } from '$/data/protocols/db/survey/check-survey-by-id-repository'
import { DbCheckSurveyById } from '$/data/usecases/survey/check-survey-by-id/db-check-survey-by-id'

describe('DbLoadSurveyById', () => {
  test('Should call checkSurveyByIdRepository with correct values', async () => {
    const { sut, checkSurveyByIdRepositoryStub } = makeSut()
    const loadAllSpy = jest.spyOn(checkSurveyByIdRepositoryStub, 'checkById')
    await sut.checkById('any_id')
    expect(loadAllSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return true on success', async () => {
    const { sut } = makeSut()
    const survey = await sut.checkById('any_id')
    expect(survey).toBe(true)
  })

  test('Should return false if survey does not exist', async () => {
    const { sut, checkSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(checkSurveyByIdRepositoryStub, 'checkById')
      .mockResolvedValueOnce(false)
    const survey = await sut.checkById('any_id')
    expect(survey).toBe(false)
  })

  test('Should throw if CheckSurveyByIdRepository throws', async () => {
    const { sut, checkSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(checkSurveyByIdRepositoryStub, 'checkById')
      .mockRejectedValueOnce(new Error())
    const promise = sut.checkById('any_id')
    await expect(promise).rejects.toThrow()
  })
})

type SutTypes = {
  sut: DbCheckSurveyById
  checkSurveyByIdRepositoryStub: CheckSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const checkSurveyByIdRepositoryStub = mockCheckSurveyByIdRepositoryStub()
  const sut = new DbCheckSurveyById(checkSurveyByIdRepositoryStub)
  return { sut, checkSurveyByIdRepositoryStub }
}
