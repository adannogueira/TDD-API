import {
  AccountModel,
  LoadAccountByRefreshToken,
  LoadAccountByRefreshTokenIdRepository,
  RefreshDecrypter
} from './load-account-by-refresh-token-protocols'

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
