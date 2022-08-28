import { AccountModel } from '../../../../domain/models/account'

export interface LoadAccountByRefreshTokenIdRepository {
  loadByRefreshTokenId: (tokenId: string) => Promise<AccountModel>
}
