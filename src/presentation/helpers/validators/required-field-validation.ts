import { MissingParamError } from '../../errors'
import { Validation } from './validation'

export class RequiredFieldValidation implements Validation {
  constructor (private readonly fieldName: string) {}

  validate (input: string): Error {
    if (!input[this.fieldName]) return new MissingParamError(this.fieldName)
  }
}
