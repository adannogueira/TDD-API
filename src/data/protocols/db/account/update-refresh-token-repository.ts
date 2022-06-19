export interface UpdateRefreshTokenRepository {
  updateRefreshToken: (id: string, token: string) => Promise<void>
}
