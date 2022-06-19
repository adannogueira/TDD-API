export interface AccessDecrypter {
  decrypt: (value: string, role?: string) => Promise<string>
}
