import { LoadSurveyRepository } from '$/data/protocols/db/survey/load-survey-repository'
import { AddSurveyRepository } from '$/data/usecases/survey/add-survey/add-survey-protocols'
import { SurveyModel } from '$/domain/models/survey'
import { LoadSurveyByIdRepository } from '$/data/usecases/survey/load-survey-by-id/load-survey-by-id-protocols'
import { AddSurveyDTO } from '$/domain/usecases/survey/add-survey'
import { MongoHelper } from '../helpers/mongo-helper'
import { ObjectId } from 'mongodb'

export class SurveyMongoRepository implements
  AddSurveyRepository,
  LoadSurveyRepository,
  LoadSurveyByIdRepository {
  async add (surveyData: AddSurveyDTO): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async loadAll (accountId: string): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    const [surveys, surveyResults] = await Promise.all([
      surveyCollection.find().toArray(),
      surveyResultCollection.find({ accountId: new ObjectId(accountId) }).toArray()
    ])
    return surveys.map(survey => {
      survey.didAnswer = surveyResults.some(result =>
        result.surveyId.toString() === survey._id.toString())
      return MongoHelper.map<SurveyModel>(survey)
    })
  }

  async loadById (id: string): Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    try {
      const survey = await surveyCollection.findOne({ _id: new ObjectId(id) })
      return survey && MongoHelper.map<SurveyModel>(survey)
    } catch (error) {
      return null
    }
  }
}
