import { AccountModel } from '@domain/models/account'

export interface LoadAccountByAccessToken {
  load: (accessToken: string, role?: string) => Promise<AccountModel>
}
