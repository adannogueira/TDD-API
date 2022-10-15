import { LoadAccountByAccessToken, HttpResponse, Middleware } from './auth-middleware-protocols'
import { AccessDeniedError, AuthExpiredError } from '../../errors'
import { forbidden, ok, serverError } from '../../helpers/http/http-helper'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByAccessToken: LoadAccountByAccessToken,
    private readonly role?: string
  ) {}

  async handle ({ accessToken }: AuthMiddleware.Request): Promise<HttpResponse> {
    try {
      if (accessToken) {
        const account = await this.loadAccountByAccessToken.load(accessToken, this.role)
        if (account) {
          return ok({ accountId: account.id })
        }
      }
      return forbidden(new AccessDeniedError())
    } catch (error) {
      return error instanceof AuthExpiredError
        ? forbidden(new AccessDeniedError())
        : serverError(error)
    }
  }
}

export namespace AuthMiddleware {
  export type Request = {
    accessToken?: string
  }
}
