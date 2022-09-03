import { RefreshController } from '@presentation/controllers/user/refresh/refresh-controller'
import { Controller } from '@presentation/protocols'
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'
import { makeDbLoadAccountByRefreshToken } from '../../../usecases/user/load-account-by-token/db-load-account-by-refresh-token-factory'
import { makeDbTokenAuthentication } from '../../../usecases/user/authentication/db-token-authentication-factory'

export const makeRefreshController = (): Controller => {
  const refreshController = new RefreshController(
    makeDbLoadAccountByRefreshToken(),
    makeDbTokenAuthentication()
  )
  return makeLogControllerDecorator(refreshController)
}
