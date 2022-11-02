import { adaptResolver } from '$/main/adapters/apollo-server-resolver-adapter'
import { makeLoadSurveyController } from '../../factories/controllers/survey/load-survey/load-survey-controller-factory'

export default {
  Query: {
    surveys: async () => await adaptResolver(makeLoadSurveyController())
  }
}
