import { AccountModel } from '$/domain/models/account'
import { TokenAuthentication, Tokens } from '$/domain/usecases/account/token-authentication'

export const mockTokenAuthentication = (): TokenAuthentication => {
  class AuthenticationStub implements TokenAuthentication {
    async authByAccount (account: AccountModel): Promise<Tokens> {
      return await Promise.resolve({
        accessToken: 'any_access_token',
        refreshToken: 'any_refresh_token'
      })
    }
  }
  return new AuthenticationStub()
}
