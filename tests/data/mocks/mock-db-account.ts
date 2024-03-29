import { AddAccountRepository } from '$/data/protocols/db/account/add-account-repository'
import { LoadAccountByAccessTokenRepository } from '$/data/protocols/db/account/load-account-by-access-token-repository'
import { LoadAccountByRefreshTokenIdRepository } from '$/data/protocols/db/account/load-account-by-refresh-token-id-repository'
import { LoadAccountByEmailRepository, UpdateAccessTokenRepository, UpdateRefreshTokenRepository } from '$/data/usecases/authentication/db-authentication-protocols'
import { mockAccount } from '$tests/domain/mocks'

export const mockAddAccountRepositoryStub = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
      return await new Promise(resolve => resolve(true))
    }
  }
  return new AddAccountRepositoryStub()
}

export const mockLoadAccountByAccessTokenRepositoryStub = (): LoadAccountByAccessTokenRepository => {
  class LoadAccountByAccessTokenRepoStub implements LoadAccountByAccessTokenRepository {
    async loadByAccessToken (
      { accessToken, role }: LoadAccountByAccessTokenRepository.Params
    ): Promise<LoadAccountByAccessTokenRepository.Result> {
      return await Promise.resolve(mockAccount())
    }
  }
  return new LoadAccountByAccessTokenRepoStub()
}

export const mockLoadAccountByEmailRepositoryStub = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepoStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<LoadAccountByEmailRepository.Result> {
      return await Promise.resolve({
        id: 'any_id',
        name: 'any_name',
        password: 'hashed_password'
      })
    }
  }
  return new LoadAccountByEmailRepoStub()
}

export const mockLoadAccountByRefreshTokenRepositoryStub = (): LoadAccountByRefreshTokenIdRepository => {
  class LoadAccountByRefreshTokenIdRepoStub implements LoadAccountByRefreshTokenIdRepository {
    async loadByRefreshTokenId (tokenId: string): Promise<LoadAccountByRefreshTokenIdRepository.Result> {
      return await Promise.resolve(mockAccount())
    }
  }
  return new LoadAccountByRefreshTokenIdRepoStub()
}

export const mockUpdateAccessTokenRepositoryStub = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken (id: string, token: string): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}

export const mockUpdateRefreshTokenRepositoryStub = (): UpdateRefreshTokenRepository => {
  class UpdateRefreshTokenRepositoryStub implements UpdateRefreshTokenRepository {
    async updateRefreshToken (id: string, tokenId: string): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new UpdateRefreshTokenRepositoryStub()
}
