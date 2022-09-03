import { AccessDecrypter } from '@data/protocols/criptography/access-decrypter'
import { LoadAccountByAccessTokenRepository } from '@data/protocols/db/account/load-account-by-access-token-repository'
import { AccountModel } from '@data/usecases/add-account/db-add-account-protocols'
import { LoadAccountByAccessToken } from '@domain/usecases/load-account-by-access-token'

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
