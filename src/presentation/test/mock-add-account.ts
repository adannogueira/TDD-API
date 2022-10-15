import { AccountModel } from '$/domain/models/account'
import { AddAccount, AddAccountDTO } from '$/domain/usecases/account/add-account'
import { mockAccount } from '$/../tests/domain/test'

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountDTO): Promise<AccountModel> {
      return await new Promise(resolve => resolve(mockAccount()))
    }
  }
  return new AddAccountStub()
}
