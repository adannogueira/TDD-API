import { LoadAccountByAccessToken } from '$/data/usecases/account/load-account-by-access-token/load-account-by-access-token-protocols'

export interface LoadAccountByAccessTokenRepository {
  loadByAccessToken: (
    params: LoadAccountByAccessTokenRepository.Params
  ) => Promise<LoadAccountByAccessTokenRepository.Result>
}

export namespace LoadAccountByAccessTokenRepository {
  export type Params = LoadAccountByAccessToken.Params
  export type Result = LoadAccountByAccessToken.Result
}
