import { AuthenticationModel } from '$/domain/models/authentication'

export interface TokenAuthentication {
  authByAccount: (
    account: TokenAuthentication.Params
  ) => Promise<TokenAuthentication.Result>
}

export namespace TokenAuthentication {
  export type Params = {
    id: string
    name: string
  }
  export type Result = AuthenticationModel
}
