import { LoadAccountByRefreshToken } from '../../../domain/usecases/load-account-by-refresh-token'
import { RefreshDecrypter } from '../../protocols/criptography/refresh-decrypter'
import { AccountModel } from '../add-account/db-add-account-protocols'

export class DbLoadAccountByRefreshToken implements LoadAccountByRefreshToken {
  constructor (
    private readonly decrypter: RefreshDecrypter
  ) {}

  async load (refreshToken: string): Promise<AccountModel> {
    await this.decrypter.decryptRefresh(refreshToken)
    return null
  }
}
