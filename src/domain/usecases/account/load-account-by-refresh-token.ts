import { AccountModel } from '$/domain/models/account'

export interface LoadAccountByRefreshToken {
  load: (refreshToken: string) => Promise<LoadAccountByRefreshToken.Result>
}

export namespace LoadAccountByRefreshToken {
  export type Result = AccountModel
}
