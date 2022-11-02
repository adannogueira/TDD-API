import {
  Controller,
  HttpResponse,
  PasswordAuthentication,
  Validation
} from './login-controller-protocols'
import { badRequest, ok, serverError, unauthorized } from '../../../helpers/http/http-helper'

export class LoginController implements Controller {
  constructor (
    private readonly authentication: PasswordAuthentication,
    private readonly validation: Validation
  ) {}

  async handle (request: LoginController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) {
        return badRequest(error)
      }
      const { email, password } = request
      const authenticationModel = await this.authentication.authByPassword({ email, password })
      if (!authenticationModel) {
        return unauthorized()
      }
      return ok(authenticationModel)
    } catch (err) {
      return serverError(err)
    }
  }
}

export namespace LoginController {
  export type Request = {
    email: string
    password: string
  }
}
