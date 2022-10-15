import { AccountModel } from '$/domain/models/account'
import { LoadAccountByAccessToken } from '$/domain/usecases/account/load-account-by-access-token'
import { mockAccount } from '$/../tests/domain/test'

export const mockLoadAccountByAccessToken = (): LoadAccountByAccessToken => {
  class LoadAccountByAccessTokenStub implements LoadAccountByAccessToken {
    async load (accessToken: string, role?: string): Promise<AccountModel> {
      return await Promise.resolve(mockAccount())
    }
  }
  return new LoadAccountByAccessTokenStub()
}
