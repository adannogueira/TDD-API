import { AccountModel } from '$/domain/models/account'
import { AuthenticationModel } from '$/domain/models/authentication'
import { TokenAuthentication } from '$/domain/usecases/account/token-authentication'

export const mockTokenAuthentication = (): TokenAuthentication => {
  class AuthenticationStub implements TokenAuthentication {
    async authByAccount (account: AccountModel): Promise<AuthenticationModel> {
      return await Promise.resolve({
        accessToken: 'any_access_token',
        refreshToken: 'any_refresh_token',
        name: 'any_name'
      })
    }
  }
  return new AuthenticationStub()
}
