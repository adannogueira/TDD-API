/* eslint-disable @typescript-eslint/no-unused-vars */
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
      await sut.save({
        surveyId: surveyId.toString(),
        accountId: accountId.toString(),
        answer: 'answer 1',
        date: new Date()
      })
      const surveyResult = await surveyResultCollection.findOne({
        surveyId,
        accountId
      })
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toStrictEqual(surveyId)
      expect(surveyResult.answer).toBe('answer 1')
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
      await sut.save({
        surveyId: surveyId.toString(),
        accountId: accountId.toString(),
        answer: 'answer 2',
        date: new Date()
      })
      const surveyResult = await surveyResultCollection.find({
        surveyId,
        accountId
      }).toArray()
      expect(surveyResult).toBeInstanceOf(Array)
      expect(surveyResult[0].surveyId).toStrictEqual(surveyId)
      expect(surveyResult[0].accountId).toStrictEqual(accountId)
      expect(surveyResult[0].answer).toBe('answer 2')
      expect(surveyResult[1]).toBeUndefined()
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

    test('Should load a survey result within 3 milliseconds', async () => {
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
      const counter: number[] = []
      for await (const _ of Array(100).fill(1)) {
        const start = new Date()
        const surveyResult = await sut.loadBySurveyId(surveyId.toString())
        const end = new Date()
        counter.push((end.getMilliseconds() - start.getMilliseconds()))
        expect(surveyResult).toBeTruthy()
        expect(surveyResult.surveyId).toEqual(surveyId.toString())
        expect(surveyResult.answers[0].count).toBe(2)
        expect(surveyResult.answers[0].percent).toBe(50)
        expect(surveyResult.answers[1].count).toBe(2)
        expect(surveyResult.answers[1].percent).toBe(50)
        expect(surveyResult.answers[2].count).toBe(0)
        expect(surveyResult.answers[2].percent).toBe(0)
      }
      expect(counter.reduce((acc, cur) => acc + cur) / 100).toBeLessThan(3)
    })

    describe('loadBySurveyIdDeprecated()', () => {
      test('Should load a survey result within 3 milliseconds', async () => {
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
        const counter: number[] = []
        for await (const _ of Array(100).fill(1)) {
          const start = new Date()
          const surveyResult = await sut.loadBySurveyIdDeprecated(surveyId.toString())
          const end = new Date()
          counter.push((end.getMilliseconds() - start.getMilliseconds()))
          expect(surveyResult).toBeTruthy()
          expect(surveyResult.surveyId).toEqual(surveyId.toString())
          expect(surveyResult.answers[0].count).toBe(2)
          expect(surveyResult.answers[0].percent).toBe(50)
          expect(surveyResult.answers[1].count).toBe(2)
          expect(surveyResult.answers[1].percent).toBe(50)
          expect(surveyResult.answers[2].count).toBe(0)
          expect(surveyResult.answers[2].percent).toBe(0)
        }
        expect(counter.reduce((acc, cur) => acc + cur) / 100).toBeLessThan(3)
      })
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
