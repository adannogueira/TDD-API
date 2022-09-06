import { IdGenerator } from '$/data/protocols/criptography/id-generator'
import { UuidAdapter } from './uuid-adapter'
import { v4, validate } from 'uuid'

describe('UuidAdapter', () => {
  test('Should call uuid v4', () => {
    const sut = makeSut()
    sut.generate()
    expect(v4).toHaveBeenCalled()
  })

  test('Should return a valid uuid', () => {
    jest.clearAllMocks()
    const sut = makeSut()
    const generatedUuid = sut.generate()
    expect(validate(generatedUuid)).toBeTruthy()
  })
})

jest.mock('uuid', () => {
  const original = jest.requireActual('uuid')
  return {
    __esModule: true,
    ...original,
    v4: jest.fn(() => original.v4())
  }
})

const makeSut = (): IdGenerator => {
  return new UuidAdapter()
}
