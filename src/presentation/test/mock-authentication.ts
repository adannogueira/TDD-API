import { PasswordAuthentication, AuthenticationDTO, Tokens } from '$/domain/usecases/account/password-authentication'

export const mockPasswordAuthentication = (): PasswordAuthentication => {
  class PasswordAuthenticationStub implements PasswordAuthentication {
    async authByPassword (authentication: AuthenticationDTO): Promise<Tokens> {
      return await Promise.resolve({
        accessToken: 'any_token',
        refreshToken: 'any_refresh_token'
      })
    }
  }
  return new PasswordAuthenticationStub()
}
