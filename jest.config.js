module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**',
    '!<rootDir>/src/**/*-protocols.ts'
  ],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  preset: '@shelf/jest-mongodb',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  globalTeardown: '<rootDir>/test-teardown-globals.js',
  moduleNameMapper: {
    '^@(?!jest|babel|mapbox)(.*)$': '<rootDir>/src/$1'
  }
}
