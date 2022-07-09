import { AccountModel } from '../models/account'

export interface TokenAuthentication {
  authByAccount: (account: AccountModel) => Promise<Tokens>
}

export interface Tokens {
  accessToken: string
  refreshToken: string
}
