export interface Decrypter {
  decrypt: (value: string, role?: string) => Promise<string>
}
