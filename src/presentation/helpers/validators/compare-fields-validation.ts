import { InvalidParamError } from '../../errors'
import { Validation } from './validation'

export class CompareFieldsValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly fieldToCompare: string) {}

  validate (input: string): Error {
    if (input[this.fieldName] !== this.fieldToCompare) {
      return new InvalidParamError(this.fieldToCompare)
    }
  }
}
