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
    this.validation.validate(httpRequest.headers)
  }
}
