import { AddAccount } from '$/domain/usecases/account/add-account'

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccount.Params): Promise<AddAccount.Result> {
      return await new Promise(resolve => resolve(true))
    }
  }
  return new AddAccountStub()
}
