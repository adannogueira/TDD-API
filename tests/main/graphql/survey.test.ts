import { MongoHelper } from '$/infra/db/mongodb/helpers'
import env from '$/main/config/env'
import { setupApolloServer } from '$/main/graphql/apollo/apollo-server'
import { ApolloServer } from 'apollo-server-express'
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'

let apolloServer: ApolloServer
let accountCollection: Collection
let surveyCollection: Collection

describe('Survey GraphQL', () => {
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
  describe('Survey Query', () => {
    const query = `
      query surveys {
        surveys {
          id
          question
          answers {
            image
            answer
          }
          date
          didAnswer
        }
      }
    `
    it('Should return surveys', async () => {
      const token = await makeUserToken()
      const now = new Date()
      await surveyCollection.insertMany([{
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        }],
        date: now
      }])
      const response = await apolloServer.executeOperation(
        { query },
        { req: { headers: { 'x-access-token': token } } } as any
      )
      const [survey] = response.data.surveys
      expect(response.data.surveys).toHaveLength(1)
      expect(survey.id).toBeTruthy()
      expect(survey.question).toBe('any_question')
      expect(survey.answers).toHaveLength(1)
      expect(survey.date).toStrictEqual(now)
      expect(survey.didAnswer).toBe(false)
    })

    it('Should return AccessDeniedError when no token is provided', async () => {
      const now = new Date()
      await surveyCollection.insertMany([{
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        }],
        date: now
      }])
      const response = await apolloServer.executeOperation({ query })
      expect(response.data).toBeFalsy()
      expect(response.errors[0].message).toBe('Access Denied')
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
