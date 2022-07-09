import { HttpRequest, HttpResponse, Middleware } from './refresh-middleware-protocols'
import { unauthorized } from '../../helpers/http/http-helper'

export class RefreshMiddleware implements Middleware {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return unauthorized()
  }
}
