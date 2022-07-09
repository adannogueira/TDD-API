import { AccountModel } from '../../../../domain/models/account'

export interface LoadAccountByRefreshTokenRepository {
  loadByRefreshToken: (token: string) => Promise<AccountModel>
}
