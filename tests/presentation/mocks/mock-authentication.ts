import { AuthenticationModel } from '$/domain/models/authentication'
import { PasswordAuthentication, AuthenticationDTO } from '$/domain/usecases/account/password-authentication'

export const mockPasswordAuthentication = (): PasswordAuthentication => {
  class PasswordAuthenticationStub implements PasswordAuthentication {
    async authByPassword (authentication: AuthenticationDTO): Promise<AuthenticationModel> {
      return await Promise.resolve({
        accessToken: 'any_token',
        refreshToken: 'any_refresh_token',
        name: 'any_name'
      })
    }
  }
  return new PasswordAuthenticationStub()
}
