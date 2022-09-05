import { AccessDecrypter } from '$/data/protocols/criptography/access-decrypter'
import { AccessEncrypter } from '$/data/protocols/criptography/access-encrypter'
import { Hasher } from '$/data/protocols/criptography/hasher'
import { HashComparer } from '$/data/protocols/criptography/hash-comparer'
import { IdGenerator } from '$/data/protocols/criptography/id-generator'
import { RefreshDecrypter } from '$/data/protocols/criptography/refresh-decrypter'
import { RefreshEncrypter } from '$/data/protocols/criptography/refresh-encrypter'

export const mockAccessDecrypter = (): AccessDecrypter => {
  class AccessDecrypterStub implements AccessDecrypter {
    async decrypt (value: string): Promise<string> {
      return await Promise.resolve('any_value')
    }
  }
  return new AccessDecrypterStub()
}

export const mockEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (id: string): Promise<string> {
      return await Promise.resolve('any_token')
    }

    async encryptRefresh (id: string, tokenId: string): Promise<string> {
      return await Promise.resolve('any_refresh_token')
    }
  }
  return new EncrypterStub()
}

export const mockHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  return new HashComparerStub()
}

export const mockHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await new Promise(resolve => resolve('hashed_password'))
    }
  }
  return new HasherStub()
}

export const mockIdGenerator = (): IdGenerator => {
  class IdGeneratorStub implements IdGenerator {
    generate (): string {
      return 'any_token_id'
    }
  }
  return new IdGeneratorStub()
}

export const mockDecrypter = (): RefreshDecrypter => {
  class DecrypterStub implements RefreshDecrypter {
    async decryptRefresh (value: string): Promise<string> {
      return await Promise.resolve('any_token_id')
    }
  }
  return new DecrypterStub()
}

export interface Encrypter extends AccessEncrypter, RefreshEncrypter {}
