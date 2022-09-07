import { passwordLoginPath, refreshPath, signupPath, surveyPath, surveyResultPath } from './paths/'

export const paths = {
  '/login': passwordLoginPath,
  '/refresh': refreshPath,
  '/signup': signupPath,
  '/surveys': surveyPath,
  '/surveys/{surveyId}/results': surveyResultPath
}
