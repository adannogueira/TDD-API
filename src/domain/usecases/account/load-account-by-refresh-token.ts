import { AccountModel } from '$/domain/models/account'

export interface LoadAccountByRefreshToken {
  load: (refreshToken: string) => Promise<AccountModel>
}

export namespace LoadAccountByAccessToken {
  export type Params = {
    accessToken: string
    role?: string
  }
  export type Result = AccountModel
}
