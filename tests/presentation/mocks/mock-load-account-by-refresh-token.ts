import { LoadAccountByRefreshToken } from '$/domain/usecases/account/load-account-by-refresh-token'
import { mockAccount } from '$tests/domain/mocks'

export const mockLoadAccountByRefreshToken = (): LoadAccountByRefreshToken => {
  class LoadAccountByRefreshTokenStub implements LoadAccountByRefreshToken {
    async load (refreshToken: string): Promise<LoadAccountByRefreshToken.Result> {
      return await Promise.resolve(mockAccount())
    }
  }
  return new LoadAccountByRefreshTokenStub()
}
