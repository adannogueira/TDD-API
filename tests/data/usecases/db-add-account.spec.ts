import { mockAddAccountRepositoryStub, mockHasher } from '$tests/data/mocks'
import { mockAccountData } from '$tests/domain/mocks'
import {
  Hasher,
  AddAccountRepository,
  CheckAccountByEmailRepository
} from '$/data/usecases/account/add-account/db-add-account-protocols'
import { DbAddAccount } from '$/data/usecases/account/add-account/db-add-account'

describe('DbAccount Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(mockAccountData())
    expect(hashSpy).toHaveBeenCalledWith('any_password')
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash')
      .mockRejectedValueOnce(new Error())
    const promise = sut.add(mockAccountData())
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.add(mockAccountData())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'hashed_password'
    })
  })

  test('Should return false if AddAccountRepository returns false', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add')
      .mockResolvedValueOnce(false)
    const account = await sut.add(mockAccountData())
    expect(account).toBe(false)
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add')
      .mockRejectedValueOnce(new Error())
    const promise = sut.add(mockAccountData())
    await expect(promise).rejects.toThrow()
  })

  test('Should return false if CheckAccountByEmailRepository returns true', async () => {
    const { sut, checkAccountByEmailRepository } = makeSut()
    jest.spyOn(checkAccountByEmailRepository, 'checkByEmail')
      .mockResolvedValueOnce(true)
    const account = await sut.add(mockAccountData())
    expect(account).toBeFalsy()
  })

  test('Should return true on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add(mockAccountData())
    expect(account).toBe(true)
  })

  test('Should call CheckAccountByEmailRepo with correct email', async () => {
    const { sut, checkAccountByEmailRepository } = makeSut()
    const loadSpy = jest.spyOn(checkAccountByEmailRepository, 'checkByEmail')
    await sut.add(mockAccountData())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})

const mockCheckAccountByEmailRepository = (): CheckAccountByEmailRepository => {
  class CheckAccountByEmailRepoStub implements CheckAccountByEmailRepository {
    async checkByEmail (email: string): Promise<CheckAccountByEmailRepository.Result> {
      return await Promise.resolve(false)
    }
  }
  return new CheckAccountByEmailRepoStub()
}

type SutTypes = {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  checkAccountByEmailRepository: CheckAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const addAccountRepositoryStub = mockAddAccountRepositoryStub()
  const hasherStub = mockHasher()
  const checkAccountByEmailRepository = mockCheckAccountByEmailRepository()
  const sut = new DbAddAccount(
    hasherStub,
    addAccountRepositoryStub,
    checkAccountByEmailRepository
  )
  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    checkAccountByEmailRepository
  }
}
