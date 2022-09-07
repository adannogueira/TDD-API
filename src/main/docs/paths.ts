import { passwordLoginPath, signupPath, surveyPath, surveyResultPath } from './paths/'

export const paths = {
  '/login': passwordLoginPath,
  '/signup': signupPath,
  '/surveys': surveyPath,
  '/surveys/{surveyId}/results': surveyResultPath
}
