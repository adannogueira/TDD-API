export type AuthenticationDTO = {
  email: string
  password: string
}

export type Tokens = {
  accessToken: string
  refreshToken: string
}

export interface PasswordAuthentication {
  authByPassword: (authentication: AuthenticationDTO) => Promise<Tokens>
}
