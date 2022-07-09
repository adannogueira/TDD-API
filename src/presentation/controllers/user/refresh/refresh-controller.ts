import { badRequest } from '../../../helpers/http/http-helper'
import {
  Controller,
  HttpRequest,
  Validation
} from './refresh-controller-protocols'

export class RefreshController implements Controller {
  constructor (
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<any> {
    const error = this.validation.validate(httpRequest.headers)
    if (error) {
      return badRequest(error)
    }
  }
}
