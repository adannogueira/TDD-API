export interface AuthenticationModel {
  email: string
  password: string
}
export interface Authentication {
  auth: (authentication: AuthenticationModel) => Promise<Tokens>
}

export interface Tokens {
  accessToken: string
  refreshToken: string
}
