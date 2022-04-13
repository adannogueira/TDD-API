import { AccountModel } from '../../../domain/models/account'
import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'
import { DbAuthentication } from './db-authentication'

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepo with correct email', async () => {
    class LoadAccountByEmailRepoStub implements LoadAccountByEmailRepository {
      async load (email: string): Promise<AccountModel> {
        const account: AccountModel = {
          id: 'valid_id',
          name: 'valid_name',
          email: 'any_email@mail.com',
          password: 'any_password'
        }
        return await Promise.resolve(account)
      }
    }
    const loadAccountByEmailRepo = new LoadAccountByEmailRepoStub()
    const sut = new DbAuthentication(loadAccountByEmailRepo)
    const loadSpy = jest.spyOn(loadAccountByEmailRepo, 'load')
    await sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password'
    })
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
