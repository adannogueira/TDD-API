import { AuthenticationModel } from '$/domain/models/authentication'

export interface PasswordAuthentication {
  authByPassword: (
    authentication: PasswordAuthentication.Params
  ) => Promise<PasswordAuthentication.Result>
}

export namespace PasswordAuthentication {
  export type Params = {
    email: string
    password: string
  }
  export type Result = AuthenticationModel
}
