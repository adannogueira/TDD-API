import { Validation } from '$/presentation/protocols'
import { EmailValidator } from '$/validation/protocols/email-validator'
import {
  ValidationComposite,
  RequiredFieldValidation,
  EmailValidation
} from '$/validation/validators'
import { makeLoginValidation } from '$/main/factories/controllers/user/login/login-validation-factory'

jest.mock('$/validation/validators/validation-composite')

const mockEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('Login Validation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLoginValidation()
    const validations: Validation[] = []
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', mockEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
