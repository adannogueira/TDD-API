import { Controller } from '$/presentation/protocols'
import { ApolloError, AuthenticationError, ForbiddenError, UserInputError } from 'apollo-server-express'

export const adaptResolver = async (controller: Controller, args: any = {}, context?: any): Promise<any> => {
  const request = { ...args, accountId: context?.req?.accountId }
  const response = await controller.handle(request)
  switch (response.statusCode) {
    case 200:
    case 204: return response.body
    case 400: throw new UserInputError(response.body.message)
    case 401: throw new AuthenticationError(response.body.message)
    case 403: throw new ForbiddenError(response.body.message)
    default: throw new ApolloError(response.body.message)
  }
}
