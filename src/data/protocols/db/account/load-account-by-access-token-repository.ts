import { AccountModel } from '../../../../domain/models/account'

export interface LoadAccountByAccessTokenRepository {
  loadByAccessToken: (token: string, role?: string) => Promise<AccountModel>
}
