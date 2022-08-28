export class AuthExpiredError extends Error {
  constructor () {
    super('Auth Expired')
    this.name = 'AuthExpiredError'
  }
}
