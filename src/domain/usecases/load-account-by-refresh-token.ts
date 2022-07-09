import { AccountModel } from '../models/account'

export interface LoadAccountByRefreshToken {
  load: (refreshToken: string) => Promise<AccountModel>
}
