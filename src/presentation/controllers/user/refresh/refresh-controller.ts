import { AuthExpiredError } from '../../../errors'
import { ok, serverError, unauthorized } from '../../../helpers/http/http-helper'
import {
  Controller,
  LoadAccountByRefreshToken,
  TokenAuthentication
} from './refresh-controller-protocols'

export class RefreshController implements Controller {
  constructor (
    private readonly loadAccountByRefreshToken: LoadAccountByRefreshToken,
    private readonly tokenAuthentication: TokenAuthentication
  ) {}

  async handle ({ refreshToken }: RefreshController.Request): Promise<any> {
    try {
      const account = await this.loadAccountByRefreshToken.load(refreshToken)
      if (!account) return unauthorized()
      const authenticationModel = await this.tokenAuthentication.authByAccount(account)
      return ok(authenticationModel)
    } catch (error) {
      return error instanceof AuthExpiredError
        ? unauthorized()
        : serverError(error)
    }
  }
}

export namespace RefreshController {
  export type Request = {
    refreshToken: string
  }
}
