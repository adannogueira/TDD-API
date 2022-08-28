import { AccountModel } from '../models/account'

export interface LoadAccountByAccessToken {
  load: (accessToken: string, role?: string) => Promise<AccountModel>
}
