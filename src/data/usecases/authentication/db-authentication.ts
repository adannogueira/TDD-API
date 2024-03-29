import { TokenAuthentication } from '$/domain/usecases/account/token-authentication'
import {
  PasswordAuthentication,
  HashComparer,
  AccessEncrypter,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
  RefreshEncrypter,
  IdGenerator,
  UpdateRefreshTokenRepository
} from './db-authentication-protocols'

export class DbAuthentication implements PasswordAuthentication, TokenAuthentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository,
    private readonly updateRefreshTokenRepository: UpdateRefreshTokenRepository,
    private readonly idGenerator: IdGenerator
  ) {}

  async authByPassword (
    authentication: PasswordAuthentication.Params
  ): Promise<PasswordAuthentication.Result> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(authentication.email)
    if (account) {
      const isValid = await this.hashComparer.compare(authentication.password, account.password)
      if (isValid) {
        const accessToken = await this.getAccessToken(account.id)
        const refreshToken = await this.getRefreshToken(account.id)
        return { accessToken, refreshToken, name: account.name }
      }
    }
    return null
  }

  async authByAccount (
    account: TokenAuthentication.Params
  ): Promise<TokenAuthentication.Result> {
    const accessToken = await this.getAccessToken(account.id)
    const refreshToken = await this.getRefreshToken(account.id)
    return { accessToken, refreshToken, name: account.name }
  }

  private async getAccessToken (accountId: string): Promise<string> {
    const accessToken = await this.encrypter.encrypt(accountId)
    await this.updateAccessTokenRepository.updateAccessToken(accountId, accessToken)
    return accessToken
  }

  private async getRefreshToken (accountId: string): Promise<string> {
    const tokenId = this.idGenerator.generate()
    const refreshToken = await this.encrypter.encryptRefresh(accountId, tokenId)
    await this.updateRefreshTokenRepository.updateRefreshToken(accountId, tokenId)
    return refreshToken
  }
}

interface Encrypter extends AccessEncrypter, RefreshEncrypter {}
