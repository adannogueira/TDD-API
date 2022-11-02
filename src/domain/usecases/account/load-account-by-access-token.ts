export interface LoadAccountByAccessToken {
  load: (params: LoadAccountByAccessToken.Params) => Promise<LoadAccountByAccessToken.Result>
}

export namespace LoadAccountByAccessToken {
  export type Params = {
    accessToken: string
    role?: string
  }
  export type Result = { id: string }
}
