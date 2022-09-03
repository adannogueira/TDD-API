import { RefreshMiddleware } from '$/presentation/middlewares/refresh/refresh-middleware'
import { Middleware } from '$/presentation/protocols'
import { makeDecrypterFactory } from '../usecases/user/criptography/decrypter-factory'

export const makeRefreshMiddleware = (): Middleware => {
  return new RefreshMiddleware(makeDecrypterFactory())
}
