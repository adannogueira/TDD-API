import { mockAccount } from '$tests/domain/mocks'
import { ok } from '$/presentation/helpers/http/http-helper'
import { Controller, HttpResponse } from '$/presentation/protocols'

export const mockController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (request: any): Promise<HttpResponse> {
      return await new Promise(resolve => resolve(ok(mockAccount())))
    }
  }
  return new ControllerStub()
}
