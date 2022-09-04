import {
  AccessDecrypter,
  AccountModel,
  LoadAccountByAccessToken,
  LoadAccountByAccessTokenRepository
} from './load-account-by-access-token-protocols'

export class DbLoadAccountByAccessToken implements LoadAccountByAccessToken {
  constructor (
    private readonly decrypter: AccessDecrypter,
    private readonly loadAccountByAccessTokenRepository: LoadAccountByAccessTokenRepository
  ) {}

  async load (accessToken: string, role?: string): Promise<AccountModel> {
    const token = await this.decrypter.decrypt(accessToken, role)
    if (token) {
      const account = await this.loadAccountByAccessTokenRepository.loadByAccessToken(accessToken, role)
      if (account) {
        return account
      }
    }
    return null
  }
}
