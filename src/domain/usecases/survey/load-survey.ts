import { SurveyModel } from '$/domain/models/survey'

export interface LoadSurvey {
  load: (accountId: string) => Promise<LoadSurvey.Result>
}

export namespace LoadSurvey {
  export type Result = SurveyModel[]
}
