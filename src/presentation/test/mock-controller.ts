import { mockAccount } from '$/../tests/domain/test'
import { ok } from '$/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '$/presentation/protocols'

export const mockController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return await new Promise(resolve => resolve(ok(mockAccount())))
    }
  }
  return new ControllerStub()
}
