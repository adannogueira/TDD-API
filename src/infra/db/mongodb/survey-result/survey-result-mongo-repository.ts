import {
  SaveSurveyResultModel,
  SaveSurveyResultRepository,
  SurveyResultModel
} from '$/data/usecases/survey-result/save-survey-result/save-survey-result-protocols'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save ({ surveyId, accountId, answer, date }: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    const { value } = await surveyResultCollection.findOneAndUpdate({
      surveyId,
      accountId
    }, {
      $set: { answer, date }
    }, {
      upsert: true,
      returnDocument: 'after'
    })
    return MongoHelper.map<SurveyResultModel>(value)
  }
}
