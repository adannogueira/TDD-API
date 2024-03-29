import { MissingParamError } from '$/presentation/errors'
import { RequiredFieldValidation } from '../../../src/validation/validators/required-field-validation'

describe('RequiredFieldValidation', () => {
  test('Should return a MissignParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({ name: 'any_name' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should not return if validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'any_name' })
    expect(error).toBeFalsy()
  })
})

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('field')
}
