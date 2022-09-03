import { AccountModel } from '$/domain/models/account'

export interface LoadAccountByRefreshToken {
  load: (refreshToken: string) => Promise<AccountModel>
}
