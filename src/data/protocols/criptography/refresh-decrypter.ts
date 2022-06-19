export interface RefreshDecrypter {
  decryptRefresh: (value: string, jti: string) => Promise<string>
}
