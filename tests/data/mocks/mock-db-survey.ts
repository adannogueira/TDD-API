import { AddSurveyRepository } from '$/data/protocols/db/survey/add-survey-repository'
import { LoadSurveyByIdRepository } from '$/data/protocols/db/survey/load-survey-by-id-repository'
import { AddSurveyDTO } from '$/data/usecases/survey/add-survey/add-survey-protocols'
import { SurveyModel } from '$/domain/models/survey'
import { mockSurvey, mockSurveys } from '$tests/domain/mocks'
import { LoadSurveyRepository } from '../protocols/db/survey/load-survey-repository'

export const mockAddSurveyRepositoryStub = (): AddSurveyRepository => {
  class AddSurveyRepoStub implements AddSurveyRepository {
    async add (data: AddSurveyDTO): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new AddSurveyRepoStub()
}

export const mockLoadSurveyByIdRepositoryStub = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (): Promise<SurveyModel> {
      return await Promise.resolve(mockSurvey())
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}

export const mockLoadSurveyRepositoryStub = (): LoadSurveyRepository => {
  class LoadSurveyRepositoryStub implements LoadSurveyRepository {
    async loadAll (): Promise<SurveyModel[]> {
      return await Promise.resolve(mockSurveys())
    }
  }
  return new LoadSurveyRepositoryStub()
}
