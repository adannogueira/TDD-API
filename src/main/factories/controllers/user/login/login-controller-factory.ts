import { LoginController } from '../../../../../presentation/controllers/user/login/login-controller'
import { Controller } from '../../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'
import { makeDbPasswordAuthentication } from '../../../usecases/user/authentication/db-password-authentication-factory'
import { makeLoginValidation } from './login-validation-factory'

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(
    makeDbPasswordAuthentication(),
    makeLoginValidation()
  )
  return makeLogControllerDecorator(loginController)
}
