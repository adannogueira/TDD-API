import { SurveyModel } from '$/domain/models/survey'
import { AddSurveyDTO } from '$/domain/usecases/survey/add-survey'

export const mockSurvey = (): SurveyModel => ({
  id: 'any_id',
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
})

export const mockSurveys = (): SurveyModel[] => ([
  mockSurvey(), {
    id: 'other_id',
    question: 'any_other_question',
    answers: [{
      image: 'any_other_image',
      answer: 'any_other_answer'
    }],
    date: new Date()
  }
])

export const mockSurveyData = (): AddSurveyDTO => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
})

export const mockSurveysData = (): AddSurveyDTO[] => ([
  mockSurveyData(),
  {
    question: 'other_question',
    answers: [{
      image: 'other_image',
      answer: 'other_answer'
    }],
    date: new Date()
  }
])
