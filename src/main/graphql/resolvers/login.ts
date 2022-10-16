import { adaptResolver } from '$/main/adapters/apollo-server-resolver-adapter'
import { makeLoginController } from '$/main/factories/controllers/user/login/login-controller-factory'
import { makeSignUpController } from '../../factories/controllers/user/signup/signup-controller-factory'

export default {
  Query: {
    login: async (parent: any, args: any) => await adaptResolver(makeLoginController(), args)
  },

  Mutation: {
    signup: async (parent: any, args: any) => await adaptResolver(makeSignUpController(), args)
  }
}
