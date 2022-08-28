export interface UpdateRefreshTokenRepository {
  updateRefreshToken: (id: string, tokenId: string) => Promise<void>
}
