import { MongoHelper } from '$/infra/db/mongodb/helpers'
import { setupApolloServer } from '$/main/graphql/apollo/apollo-server'
import { ApolloServer } from 'apollo-server-express'
import { hash } from 'bcrypt'
import { Collection } from 'mongodb'

let apolloServer: ApolloServer
let accountCollection: Collection

describe('Account GraphQL', () => {
  beforeAll(async () => {
    apolloServer = setupApolloServer()
    await MongoHelper.connect(process.env.MONGO_URL!)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })
  describe('Login Query', () => {
    const query = `
      query login ($email: String!, $password: String!) {
        login (email: $email, password: $password) {
          accessToken
          refreshToken
          name
        }
      }
    `
    it('Should return an Account on valid credentials', async () => {
      const password = await hash('123456', 12)
      await accountCollection.insertOne({
        name: 'John Doe',
        email: 'john@gmail.com',
        password
      })
      const response = await apolloServer.executeOperation({
        query,
        variables: {
          email: 'john@gmail.com',
          password: '123456'
        }
      })
      expect(response.data.login.accessToken).toBeTruthy()
      expect(response.data.login.refreshToken).toBeTruthy()
      expect(response.data.login.name).toBe('John Doe')
    })
  })
})
