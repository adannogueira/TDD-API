import { AuthenticationModel } from '$/domain/models/authentication'

export type AuthenticationDTO = {
  email: string
  password: string
}

export interface PasswordAuthentication {
  authByPassword: (authentication: AuthenticationDTO) => Promise<AuthenticationModel>
}
