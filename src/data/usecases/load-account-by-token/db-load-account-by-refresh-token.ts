import { RefreshDecrypter } from '@data/protocols/criptography/refresh-decrypter'
import { LoadAccountByRefreshTokenIdRepository } from '@data/protocols/db/account/load-account-by-refresh-token-id-repository'
import { AccountModel } from '@data/usecases/add-account/db-add-account-protocols'
import { LoadAccountByRefreshToken } from '@domain/usecases/load-account-by-refresh-token'

export class DbLoadAccountByRefreshToken implements LoadAccountByRefreshToken {
  constructor (
    private readonly decrypter: RefreshDecrypter,
    private readonly loadAccountByRefreshTokenIdRepository: LoadAccountByRefreshTokenIdRepository
  ) {}

  async load (refreshToken: string): Promise<AccountModel> {
    const tokenId = await this.decrypter.decryptRefresh(refreshToken)
    if (tokenId) {
      const account = await this.loadAccountByRefreshTokenIdRepository.loadByRefreshTokenId(tokenId)
      if (account) {
        const { password, ...accountWithoutPassword } = account
        return accountWithoutPassword
      }
    }
    return null
  }
}
