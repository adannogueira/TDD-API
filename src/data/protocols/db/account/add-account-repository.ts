import { AccountModel } from '$/domain/models/account'
import { AddAccountDTO } from '$/domain/usecases/account/add-account'

export interface AddAccountRepository {
  add: (accountData: AddAccountDTO) => Promise<AccountModel>
}
