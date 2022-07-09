export interface RefreshDecrypter {
  decryptRefresh: (value: string) => Promise<string>
}
