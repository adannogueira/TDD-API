import { AccessDecrypter } from '$/data/protocols/criptography/access-decrypter'
import { HttpResponse, Middleware } from './refresh-middleware-protocols'
import { ok, serverError, unauthorized } from '../../helpers/http/http-helper'
import { AuthExpiredError } from '../../errors'

export class RefreshMiddleware implements Middleware {
  constructor (private readonly accessDecrypter: AccessDecrypter) {}

  async handle ({ accessToken, refreshToken }: RefreshMiddleware.Request): Promise<HttpResponse> {
    if (!refreshToken || !accessToken) return unauthorized()
    try {
      const token = await this.accessDecrypter.decrypt(accessToken)
      if (token) return unauthorized()
    } catch (error) {
      return error instanceof AuthExpiredError
        ? ok({ refreshToken })
        : serverError(error)
    }
  }
}

export namespace RefreshMiddleware {
  export type Request = {
    accessToken?: string
    refreshToken?: string
  }
}
