import { MongoHelper } from '../helpers/mongo-helper'
import { Collection, ObjectId } from 'mongodb'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'

describe('Survey Result Mongodb Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL!)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
  })
  describe('save()', () => {
    test('Should save a NEW survey result', async () => {
      const surveyId = await makeSurveyId()
      const accountId = await makeAccountId()
      const sut = makeSut()
      const surveyResult = await sut.save({
        surveyId: surveyId.toString(),
        accountId: accountId.toString(),
        answer: 'answer 1',
        date: new Date()
      })
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toEqual(surveyId.toString())
      expect(surveyResult.answers[0].count).toBe(1)
      expect(surveyResult.answers[0].percent).toBe(100)
      expect(surveyResult.answers[0].answer).toBe('answer 1')
      expect(surveyResult.answers[1].count).toBe(0)
      expect(surveyResult.answers[1].percent).toBe(0)
    })

    test('Should update an existing survey result', async () => {
      const surveyId = await makeSurveyId()
      const accountId = await makeAccountId()
      await surveyResultCollection.insertOne({
        surveyId,
        accountId,
        answer: 'answer 1',
        date: new Date()
      })
      const sut = makeSut()
      const surveyResult = await sut.save({
        surveyId: surveyId.toString(),
        accountId: accountId.toString(),
        answer: 'answer 2',
        date: new Date()
      })
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toEqual(surveyId.toString())
      expect(surveyResult.answers[0].count).toBe(1)
      expect(surveyResult.answers[0].percent).toBe(100)
      expect(surveyResult.answers[0].answer).toBe('answer 2')
      expect(surveyResult.answers[1].count).toBe(0)
      expect(surveyResult.answers[1].percent).toBe(0)
    })
  })

  describe('loadBySurveyId()', () => {
    test('Should load a survey result', async () => {
      const surveyId = await makeSurveyId()
      const accountId = await makeAccountId()
      await surveyResultCollection.insertMany([{
        surveyId,
        accountId,
        answer: 'answer 1',
        date: new Date()
      }, {
        surveyId,
        accountId,
        answer: 'answer 1',
        date: new Date()
      }, {
        surveyId,
        accountId,
        answer: 'answer 2',
        date: new Date()
      }, {
        surveyId,
        accountId,
        answer: 'answer 2',
        date: new Date()
      }])
      const sut = makeSut()
      const surveyResult = await sut.loadBySurveyId(surveyId.toString())
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toEqual(surveyId.toString())
      expect(surveyResult.answers[0].count).toBe(2)
      expect(surveyResult.answers[0].percent).toBe(50)
      expect(surveyResult.answers[1].count).toBe(2)
      expect(surveyResult.answers[1].percent).toBe(50)
      expect(surveyResult.answers[2].count).toBe(0)
      expect(surveyResult.answers[2].percent).toBe(0)
    })
  })
})

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

const makeSurveyId = async (): Promise<ObjectId> => {
  const res = await surveyCollection.insertOne({
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'answer 1'
    }, {
      answer: 'answer 2'
    }, {
      answer: 'answer 3'
    }],
    date: new Date()
  })
  return res.insertedId
}

const makeAccountId = async (): Promise<ObjectId> => {
  const res = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any@email.com',
    password: 'any_password'
  })
  return res.insertedId
}
