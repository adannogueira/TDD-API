export class AccessDeniedError extends Error {
  constructor (reason?: string) {
    super('Access Denied')
    this.name = 'AccessDeniedError'
  }
}
