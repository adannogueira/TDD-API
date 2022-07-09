import { badRequest, ok, serverError, unauthorized } from '../../../helpers/http/http-helper'
import {
  Controller,
  HttpRequest,
  LoadAccountByRefreshToken,
  TokenAuthentication,
  Validation
} from './refresh-controller-protocols'

export class RefreshController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly loadAccountByRefreshToken: LoadAccountByRefreshToken,
    private readonly tokenAuthentication: TokenAuthentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<any> {
    try {
      const error = this.validation.validate(httpRequest.headers)
      if (error) {
        return badRequest(error)
      }
      const refreshToken = httpRequest.headers?.['x-refresh-token']
      const account = await this.loadAccountByRefreshToken.load(refreshToken)
      if (!account) return unauthorized()
      const tokens = await this.tokenAuthentication.authByAccount(account)
      return ok(tokens)
    } catch (error) {
      return serverError(error)
    }
  }
}
