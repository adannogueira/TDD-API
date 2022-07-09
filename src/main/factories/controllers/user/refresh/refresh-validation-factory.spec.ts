import {
  ValidationComposite,
  RequiredFieldValidation
} from '../../../../../validation/validators'
import { makeRefreshValidation } from './refresh-validation-factory'
import { Validation } from '../../../../../presentation/protocols'

jest.mock('../../../../../validation/validators/validation-composite')

describe('Refresh Validation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeRefreshValidation()
    const validations: Validation[] = []
    validations.push(new RequiredFieldValidation('x-refresh-token'))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
