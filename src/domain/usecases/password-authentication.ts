export interface AuthenticationModel {
  email: string
  password: string
}
export interface PasswordAuthentication {
  authByPassword: (authentication: AuthenticationModel) => Promise<Tokens>
}

export interface Tokens {
  accessToken: string
  refreshToken: string
}
