import { LoadAccountByRefreshToken } from '../../../domain/usecases/load-account-by-refresh-token'
import { RefreshDecrypter } from '../../protocols/criptography/refresh-decrypter'
import { LoadAccountByRefreshTokenRepository } from '../../protocols/db/account/load-account-by-refresh-token-repository'
import { AccountModel } from '../add-account/db-add-account-protocols'

export class DbLoadAccountByRefreshToken implements LoadAccountByRefreshToken {
  constructor (
    private readonly decrypter: RefreshDecrypter,
    private readonly loadAccountByRefreshTokenRepository: LoadAccountByRefreshTokenRepository
  ) {}

  async load (refreshToken: string): Promise<AccountModel> {
    const token = await this.decrypter.decryptRefresh(refreshToken)
    if (token) {
      const account = await this.loadAccountByRefreshTokenRepository.loadByRefreshToken(refreshToken)
      if (account) {
        return account
      }
    }
    return null
  }
}
