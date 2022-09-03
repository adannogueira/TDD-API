import { IdGenerator } from '@data/protocols/criptography/id-generator'
import { v4 as uuid } from 'uuid'

export class UuidAdapter implements IdGenerator {
  generate (): string {
    return uuid()
  }
}
