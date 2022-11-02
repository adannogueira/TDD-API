import { LoadAccountByRefreshToken } from '$/data/usecases/account/load-account-by-refresh-token/load-account-by-refresh-token-protocols'

export interface LoadAccountByRefreshTokenIdRepository {
  loadByRefreshTokenId: (tokenId: string) => Promise<LoadAccountByRefreshTokenIdRepository.Result>
}

export namespace LoadAccountByRefreshTokenIdRepository {
  export type Result = LoadAccountByRefreshToken.Result
}
