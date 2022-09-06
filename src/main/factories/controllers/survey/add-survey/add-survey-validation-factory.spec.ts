import { Validation } from '$/presentation/protocols'
import {
  ValidationComposite,
  RequiredFieldValidation
} from '$/validation/validators'
import { mockAddSurveyValidation } from './add-survey-validation-factory'
jest.mock('$/validation/validators/validation-composite')

describe('Add Survey Validation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    mockAddSurveyValidation()
    const validations: Validation[] = []
    for (const field of ['question', 'answers']) {
      validations.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
