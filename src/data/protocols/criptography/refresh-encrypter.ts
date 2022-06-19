export interface RefreshEncrypter {
  encryptRefresh: (value: string, jti: string) => Promise<string>
}
