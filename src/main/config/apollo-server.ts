import resolvers from '$/main/graphql/resolvers'
import typeDefs from '$/main/graphql/type-defs'
import { ApolloServer } from 'apollo-server-express'
import { GraphQLError } from 'graphql'

const handleErrors = (response: any, errors: readonly GraphQLError[]): void => {
  errors?.forEach(error => {
    response.data = undefined
    response.http.status = checkError(error.originalError.name || error.name)
  })
}

const checkError = (errorName: string): boolean => {
  const errors = {
    UserInputError: 400,
    AuthenticationError: 401,
    ForbiddenError: 403
  }
  return errors[errorName] || 500
}

export const setupApolloServer = (): ApolloServer => new ApolloServer({
  resolvers,
  typeDefs,
  plugins: [{
    requestDidStart: async () => ({
      willSendResponse: async ({ response, errors }) => handleErrors(response, errors)
    })
  }]
})
