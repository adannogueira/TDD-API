export type SurveyResultModel = {
  surveyId: string
  question: string
  answers: SurveyAnswerModel[]
  date: Date
}

export type SurveyAnswerModel = {
  image?: string
  answer: string
  count: number
  percent: number
}
