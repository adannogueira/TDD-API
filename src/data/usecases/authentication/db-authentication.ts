import {
  Authentication,
  Tokens,
  AuthenticationModel,
  HashComparer,
  AccessEncrypter,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
  RefreshEncrypter,
  IdGenerator
} from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository,
    private readonly idGenerator: IdGenerator
  ) {}

  async auth (authentication: AuthenticationModel): Promise<Tokens> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(authentication.email)
    if (account) {
      const isValid = await this.hashComparer.compare(authentication.password, account.password)
      if (isValid) {
        const accessToken = await this.encrypter.encrypt(account.id)
        const jti = this.idGenerator.generate()
        const refreshToken = await this.encrypter.encryptRefresh(account.id, jti)
        await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken)
        return { accessToken, refreshToken }
      }
    }
    return null
  }
}

interface Encrypter extends AccessEncrypter, RefreshEncrypter {}
