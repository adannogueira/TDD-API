import { IdGenerator } from '../../../data/protocols/criptography/id-generator'
import { UuidAdapter } from './uuid-adapter'
import * as uuid from 'uuid'

jest.mock('uuid')

describe('UuidAdapter', () => {
  test('Should call uuid v4', () => {
    const sut = makeSut()
    const generateSpy = jest.spyOn(uuid, 'v4')
    sut.generate()
    expect(generateSpy).toHaveBeenCalled()
  })
})

const makeSut = (): IdGenerator => {
  return new UuidAdapter()
}
