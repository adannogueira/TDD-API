import { ok, serverError, unauthorized } from '../../../helpers/http/http-helper'
import {
  Controller,
  HttpRequest,
  LoadAccountByRefreshToken,
  TokenAuthentication
} from './refresh-controller-protocols'

export class RefreshController implements Controller {
  constructor (
    private readonly loadAccountByRefreshToken: LoadAccountByRefreshToken,
    private readonly tokenAuthentication: TokenAuthentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<any> {
    try {
      const refreshToken = httpRequest.headers['x-refresh-token']
      const account = await this.loadAccountByRefreshToken.load(refreshToken)
      if (!account) return unauthorized()
      const tokens = await this.tokenAuthentication.authByAccount(account)
      return ok(tokens)
    } catch (error) {
      return serverError(error)
    }
  }
}
