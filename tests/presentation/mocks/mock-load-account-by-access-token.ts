import { LoadAccountByAccessToken } from '$/domain/usecases/account/load-account-by-access-token'
import { mockAccount } from '$tests/domain/mocks'

export const mockLoadAccountByAccessToken = (): LoadAccountByAccessToken => {
  class LoadAccountByAccessTokenStub implements LoadAccountByAccessToken {
    async load (
      { accessToken, role }: LoadAccountByAccessToken.Params
    ): Promise<LoadAccountByAccessToken.Result> {
      return await Promise.resolve(mockAccount())
    }
  }
  return new LoadAccountByAccessTokenStub()
}
