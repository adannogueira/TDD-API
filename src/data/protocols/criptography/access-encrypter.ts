export interface AccessEncrypter {
  encrypt: (value: string) => Promise<string>
}
