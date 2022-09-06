import { AccountModel } from '$/domain/models/account'

export type AddAccountDTO = Omit<AccountModel, 'id'>

export interface AddAccount {
  add: (account: AddAccountDTO) => Promise<AccountModel>
}
