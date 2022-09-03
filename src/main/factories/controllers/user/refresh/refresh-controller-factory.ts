import { makeLogControllerDecorator } from '$/main/factories/decorators/log-controller-decorator-factory'
import { makeDbTokenAuthentication } from '$/main/factories/usecases/user/authentication/db-token-authentication-factory'
import { makeDbLoadAccountByRefreshToken } from '$/main/factories/usecases/user/load-account-by-token/db-load-account-by-refresh-token-factory'
import { RefreshController } from '$/presentation/controllers/user/refresh/refresh-controller'
import { Controller } from '$/presentation/protocols'

export const makeRefreshController = (): Controller => {
  const refreshController = new RefreshController(
    makeDbLoadAccountByRefreshToken(),
    makeDbTokenAuthentication()
  )
  return makeLogControllerDecorator(refreshController)
}
