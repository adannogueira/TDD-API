import {
  PasswordAuthentication,
  Tokens,
  AuthenticationModel,
  HashComparer,
  AccessEncrypter,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
  RefreshEncrypter,
  IdGenerator,
  UpdateRefreshTokenRepository
} from './db-authentication-protocols'

export class DbAuthentication implements PasswordAuthentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository,
    private readonly updateRefreshTokenRepository: UpdateRefreshTokenRepository,
    private readonly idGenerator: IdGenerator
  ) {}

  async authByPassword (authentication: AuthenticationModel): Promise<Tokens> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(authentication.email)
    if (account) {
      const isValid = await this.hashComparer.compare(authentication.password, account.password)
      if (isValid) {
        const accessToken = await this.encrypter.encrypt(account.id)
        const tokenId = this.idGenerator.generate()
        const refreshToken = await this.encrypter.encryptRefresh(account.id, tokenId)
        await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken)
        await this.updateRefreshTokenRepository.updateRefreshToken(account.id, tokenId)
        return { accessToken, refreshToken }
      }
    }
    return null
  }
}

interface Encrypter extends AccessEncrypter, RefreshEncrypter {}
