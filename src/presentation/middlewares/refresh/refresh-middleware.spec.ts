import { unauthorized } from '../../helpers/http/http-helper'
import { RefreshMiddleware } from './refresh-middleware'

describe('Refresh Middleware', () => {
  test('Should return 401 if no x-refresh-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(unauthorized())
  })
})

interface sutTypes {
  sut: RefreshMiddleware
}

const makeSut = (): sutTypes => {
  const sut = new RefreshMiddleware()
  return {
    sut
  }
}
