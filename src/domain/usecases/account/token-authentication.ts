import { AccountModel } from '$/domain/models/account'
import { AuthenticationModel } from '$/domain/models/authentication'

export interface TokenAuthentication {
  authByAccount: (account: AccountModel) => Promise<AuthenticationModel>
}
