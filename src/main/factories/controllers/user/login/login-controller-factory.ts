import { makeLogControllerDecorator } from '$/main/factories/decorators/log-controller-decorator-factory'
import { makeDbPasswordAuthentication } from '$/main/factories/usecases/user/authentication/db-password-authentication-factory'
import { LoginController } from '$/presentation/controllers/user/login/login-controller'
import { Controller } from '$/presentation/protocols'
import { makeLoginValidation } from './login-validation-factory'

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(
    makeDbPasswordAuthentication(),
    makeLoginValidation()
  )
  return makeLogControllerDecorator(loginController)
}
