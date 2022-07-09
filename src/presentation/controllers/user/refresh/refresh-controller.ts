import { badRequest, serverError } from '../../../helpers/http/http-helper'
import {
  Controller,
  HttpRequest,
  LoadAccountByRefreshToken,
  Validation
} from './refresh-controller-protocols'

export class RefreshController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly loadAccountByRefreshToken: LoadAccountByRefreshToken
  ) {}

  async handle (httpRequest: HttpRequest): Promise<any> {
    try {
      const error = this.validation.validate(httpRequest.headers)
      if (error) {
        return badRequest(error)
      }
      const refreshToken = httpRequest.headers?.['x-refresh-token']
      await this.loadAccountByRefreshToken.load(refreshToken)
    } catch (error) {
      return serverError(error)
    }
  }
}
