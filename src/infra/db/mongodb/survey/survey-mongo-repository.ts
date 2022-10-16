import { LoadSurveyRepository } from '$/data/protocols/db/survey/load-survey-repository'
import { AddSurveyRepository } from '$/data/usecases/survey/add-survey/add-survey-protocols'
import { SurveyModel } from '$/domain/models/survey'
import { LoadSurveyByIdRepository } from '$/data/usecases/survey/load-survey-by-id/load-survey-by-id-protocols'
import { MongoHelper } from '../helpers/mongo-helper'
import { ObjectId } from 'mongodb'
import { CheckSurveyByIdRepository } from '../../../../data/usecases/survey/check-survey-by-id/check-survey-by-id-protocols'

export class SurveyMongoRepository implements
  AddSurveyRepository,
  LoadSurveyRepository,
  LoadSurveyByIdRepository,
  CheckSurveyByIdRepository {
  async add (surveyData: AddSurveyRepository.Params): Promise<void> {
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

  async loadById (id: string): Promise<LoadSurveyByIdRepository.Result> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    try {
      const survey = await surveyCollection.findOne({ _id: new ObjectId(id) })
      return survey && MongoHelper.map<SurveyModel>(survey)
    } catch (error) {
      return null
    }
  }

  async checkById (id: string): Promise<CheckSurveyByIdRepository.Result> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    try {
      const survey = await surveyCollection.findOne({
        _id: new ObjectId(id)
      }, {
        projection: {
          _id: 1
        }
      })
      return Boolean(survey)
    } catch (error) {
      return false
    }
  }
}
