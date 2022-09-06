import { AccountModel } from '$/domain/models/account'
import { AddAccountDTO } from '$/domain/usecases/account/add-account'
import { AuthenticationDTO } from '../usecases/account/password-authentication'

export const mockAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password'
})

export const mockAccountData = (): AddAccountDTO => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

export const mockAuthentication = (): AuthenticationDTO => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})
