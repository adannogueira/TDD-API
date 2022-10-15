import {
  AccessDecrypter,
  LoadAccountByAccessToken,
  LoadAccountByAccessTokenRepository
} from './load-account-by-access-token-protocols'

export class DbLoadAccountByAccessToken implements LoadAccountByAccessToken {
  constructor (
    private readonly decrypter: AccessDecrypter,
    private readonly loadAccountByAccessTokenRepository: LoadAccountByAccessTokenRepository
  ) {}

  async load (
    { accessToken, role }: LoadAccountByAccessToken.Params
  ): Promise<LoadAccountByAccessToken.Result> {
    const token = await this.decrypter.decrypt(accessToken, role)
    if (token) {
      const account = await this.loadAccountByAccessTokenRepository.loadByAccessToken({
        accessToken,
        role
      })
      if (account) {
        return account
      }
    }
    return null
  }
}
