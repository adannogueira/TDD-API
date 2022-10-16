import { AddSurveyRepository } from '$/data/protocols/db/survey/add-survey-repository'
import { LoadSurveyByIdRepository } from '$/data/protocols/db/survey/load-survey-by-id-repository'
import { mockSurvey, mockSurveys } from '$tests/domain/mocks'
import { CheckSurveyByIdRepository } from '../protocols/db/survey/check-survey-by-id-repository'
import { LoadSurveyRepository } from '../protocols/db/survey/load-survey-repository'

export const mockAddSurveyRepositoryStub = (): AddSurveyRepository => {
  class AddSurveyRepoStub implements AddSurveyRepository {
    async add (data: AddSurveyRepository.Params): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new AddSurveyRepoStub()
}

export const mockLoadSurveyByIdRepositoryStub = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (): Promise<LoadSurveyByIdRepository.Result> {
      return await Promise.resolve(mockSurvey())
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}

export const mockLoadSurveyRepositoryStub = (): LoadSurveyRepository => {
  class LoadSurveyRepositoryStub implements LoadSurveyRepository {
    async loadAll (): Promise<LoadSurveyRepository.Result> {
      return await Promise.resolve(mockSurveys())
    }
  }
  return new LoadSurveyRepositoryStub()
}

export const mockCheckSurveyByIdRepositoryStub = (): CheckSurveyByIdRepository => {
  class CheckSurveyByIdRepositoryStub implements CheckSurveyByIdRepository {
    async checkById (): Promise<CheckSurveyByIdRepository.Result> {
      return await Promise.resolve(true)
    }
  }
  return new CheckSurveyByIdRepositoryStub()
}
