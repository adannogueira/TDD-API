import {
  RequiredFieldValidation,
  ValidationComposite
} from '../../../../../validation/validators'
import { Validation } from '../../../../../presentation/protocols/validation'

export const makeRefreshValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  validations.push(new RequiredFieldValidation('x-refresh-token'))
  return new ValidationComposite(validations)
}
