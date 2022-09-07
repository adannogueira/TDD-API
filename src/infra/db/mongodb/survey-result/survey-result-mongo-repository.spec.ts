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
        answer: 'any_answer',
        date: new Date()
      })
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toEqual(surveyId.toString())
      expect(surveyResult.answers[0].count).toBe(1)
      expect(surveyResult.answers[0].percent).toBe(100)
      expect(surveyResult.answers[0].answer).toBe('any_answer')
      expect(surveyResult.answers[1].count).toBe(0)
      expect(surveyResult.answers[1].percent).toBe(0)
    })

    test('Should update an existing survey result', async () => {
      const surveyId = await makeSurveyId()
      const accountId = await makeAccountId()
      await surveyResultCollection.insertOne({
        surveyId,
        accountId,
        answer: 'any_answer',
        date: new Date()
      })
      const sut = makeSut()
      const surveyResult = await sut.save({
        surveyId: surveyId.toString(),
        accountId: accountId.toString(),
        answer: 'other_answer',
        date: new Date()
      })
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toEqual(surveyId.toString())
      expect(surveyResult.answers[0].count).toBe(1)
      expect(surveyResult.answers[0].percent).toBe(100)
      expect(surveyResult.answers[0].answer).toBe('other_answer')
      expect(surveyResult.answers[1].count).toBe(0)
      expect(surveyResult.answers[1].percent).toBe(0)
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
      answer: 'any_answer'
    }, {
      answer: 'other_answer'
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
