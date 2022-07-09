import { SignUpController } from '../../../../../presentation/controllers/user/signup/signup-controller'
import { Controller } from '../../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'
import { makeDbAddAccount } from '../../../usecases/user/add-account/db-add-account-factory'
import { makeDbPasswordAuthentication } from '../../../usecases/user/authentication/db-password-authentication-factory'
import { makeSignUpValidation } from './signup-validation-factory'

export const makeSignUpController = (): Controller => {
  const signUpController = new SignUpController(
    makeDbAddAccount(),
    makeSignUpValidation(),
    makeDbPasswordAuthentication()
  )
  return makeLogControllerDecorator(signUpController)
}
