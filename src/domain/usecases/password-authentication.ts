export type AuthenticationModel = {
  email: string
  password: string
}

export type Tokens = {
  accessToken: string
  refreshToken: string
}

export interface PasswordAuthentication {
  authByPassword: (authentication: AuthenticationModel) => Promise<Tokens>
}
