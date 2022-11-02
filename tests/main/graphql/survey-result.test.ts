import { MongoHelper } from '$/infra/db/mongodb/helpers'
import env from '$/main/config/env'
import { setupApolloServer } from '$/main/graphql/apollo/apollo-server'
import { ApolloServer } from 'apollo-server-express'
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'

let apolloServer: ApolloServer
let accountCollection: Collection
let surveyCollection: Collection

describe('SurveyResult GraphQL', () => {
  beforeAll(async () => {
    apolloServer = setupApolloServer()
    await MongoHelper.connect(process.env.MONGO_URL!)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await surveyCollection.deleteMany({})
  })
  describe('SurveyResult Query', () => {
    const query = `
      query surveyResult ($surveyId: String!) {
        surveyResult (surveyId: $surveyId) {
          question
          answers {
            answer
            count
            percent
            isCurrentAccountAnswer
          }
          date
        }
      }
    `
    it('Should return surveyResults', async () => {
      const token = await makeUserToken()
      const now = new Date()
      const survey = await surveyCollection.insertMany([{
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        }],
        date: now
      }])
      const response = await apolloServer.executeOperation(
        { query, variables: { surveyId: survey.insertedIds[0].toString() } },
        { req: { headers: { 'x-access-token': token } } } as any
      )
      const { surveyResult } = response.data
      expect(surveyResult.question).toBe('any_question')
      expect(surveyResult.date).toStrictEqual(now)
      expect(surveyResult.answers).toEqual([{
        answer: 'any_answer',
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: false
      }])
    })

    it('Should return AccessDeniedError when no token is provided', async () => {
      const survey = await surveyCollection.insertMany([{
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        }],
        date: new Date()
      }])
      const response = await apolloServer.executeOperation({
        query, variables: { surveyId: survey.insertedIds[0].toString() }
      })
      expect(response.data).toBeFalsy()
      expect(response.errors[0].message).toBe('Access Denied')
    })
  })

  describe('SaveSurveyResult Mutation', () => {
    const query = `
      mutation saveSurveyResult ($surveyId: String!, $answer: String!) {
        saveSurveyResult (surveyId: $surveyId, answer: $answer) {
          question
          answers {
            answer
            count
            percent
            isCurrentAccountAnswer
          }
          date
        }
      }
    `
    it('Should return surveyResults', async () => {
      const token = await makeUserToken()
      const now = new Date()
      const survey = await surveyCollection.insertMany([{
        question: 'any_question',
        answers: [{ answer: 'First' }, { answer: 'Second' }],
        date: now
      }])
      const response = await apolloServer.executeOperation({
        query,
        variables: {
          surveyId: survey.insertedIds[0].toString(),
          answer: 'First'
        }
      }, {
        req: { headers: { 'x-access-token': token } }
      } as any)
      const { saveSurveyResult } = response.data
      expect(saveSurveyResult.question).toBe('any_question')
      expect(saveSurveyResult.date).toStrictEqual(now)
      expect(saveSurveyResult.answers).toEqual([{
        answer: 'First',
        count: 1,
        percent: 100,
        isCurrentAccountAnswer: true
      }, {
        answer: 'Second',
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: false
      }])
    })
  })
})

const makeUserToken = async (
  { admin, expired }: { admin?: boolean, expired?: boolean } = {}
): Promise<string> => {
  const user = await accountCollection.insertOne({
    name: 'John Doe',
    email: 'john@mail.com',
    password: 'any_password',
    role: admin ? 'admin' : undefined
  })
  const id = user.insertedId.toString()
  const accessToken = sign(
    { id },
    env.jwtSecret,
    { expiresIn: expired ? '0s' : '5m' }
  )
  await accountCollection.updateOne({
    _id: user.insertedId
  }, {
    $set: {
      accessToken
    }
  })
  return accessToken
}
