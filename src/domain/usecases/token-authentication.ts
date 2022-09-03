import { AccountModel } from '@domain/models/account'

export type Tokens = {
  accessToken: string
  refreshToken: string
}

export interface TokenAuthentication {
  authByAccount: (account: AccountModel) => Promise<Tokens>
}
