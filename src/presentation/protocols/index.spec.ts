import * as index from './'

describe('Index', () => {
  test('should have exports', () => {
    expect(typeof index).toBe('object')
  })

  test('should not have undefined exports', () => {
    Object.keys(index).forEach((exportKey) =>
      expect(Boolean(index[exportKey])).toBe(true)
    )
  })
})
