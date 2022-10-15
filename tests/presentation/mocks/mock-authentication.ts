import { PasswordAuthentication } from '$/domain/usecases/account/password-authentication'

export const mockPasswordAuthentication = (): PasswordAuthentication => {
  class PasswordAuthenticationStub implements PasswordAuthentication {
    async authByPassword (
      authentication: PasswordAuthentication.Params
    ): Promise<PasswordAuthentication.Result> {
      return await Promise.resolve({
        accessToken: 'any_token',
        refreshToken: 'any_refresh_token',
        name: 'any_name'
      })
    }
  }
  return new PasswordAuthenticationStub()
}
