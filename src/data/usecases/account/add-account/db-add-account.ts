import {
  AddAccount,
  AddAccountRepository,
  Hasher,
  CheckAccountByEmailRepository
} from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly checkAccountByEmailRepository: CheckAccountByEmailRepository
  ) {}

  async add (accountData: AddAccount.Params): Promise<AddAccount.Result> {
    const foundAccount = await this.checkAccountByEmailRepository.checkByEmail(accountData.email)
    if (foundAccount) return false
    const hashedPassword = await this.hasher.hash(accountData.password)
    const account = await this.addAccountRepository.add({ ...accountData, password: hashedPassword })
    return account
  }
}
