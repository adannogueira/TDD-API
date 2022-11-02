import { mockSurveyData, mockSurveysData } from '$tests/domain/mocks'
import { SurveyMongoRepository } from '$/infra/db/mongodb/survey/survey-mongo-repository'
import { MongoHelper } from '$/infra/db/mongodb/helpers/mongo-helper'
import { Collection, ObjectId } from 'mongodb'

describe('Survey Mongodb Repository', () => {
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
  describe('add()', () => {
    test('Should save a survey on add success', async () => {
      const sut = makeSut()
      await sut.add(mockSurveyData())
      const survey = await surveyCollection.findOne({ question: 'any_question' })
      expect(survey).toBeTruthy()
    })
  })

  describe('loadAll()', () => {
    test('Should load all surveys on loadAll success', async () => {
      const accountId = await makeAccountId()
      const result = await surveyCollection.insertMany(mockSurveysData())
      await surveyResultCollection.insertOne({
        accountId: new ObjectId(accountId),
        surveyId: result.insertedIds[0],
        answer: 'any_answer',
        date: new Date()
      })
      const sut = makeSut()
      const surveys = await sut.loadAll(accountId)
      expect(surveys).toBeInstanceOf(Array)
      expect(surveys[0].question).toBe('any_question')
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].didAnswer).toBeTruthy()
      expect(surveys[1].question).toBe('other_question')
      expect(surveys[1].id).toBeTruthy()
      expect(surveys[1].didAnswer).toBeFalsy()
    })

    test('Should return an empty array when no data is found', async () => {
      const accountId = await makeAccountId()
      const sut = makeSut()
      const surveys = await sut.loadAll(accountId)
      expect(surveys).toBeInstanceOf(Array)
      expect(surveys.length).toBe(0)
    })
  })

  describe('loadById()', () => {
    test('Should load survey by id on success', async () => {
      const res = await surveyCollection.insertOne(mockSurveyData())
      const id = res.insertedId.toString()
      const sut = makeSut()
      const survey = await sut.loadById(id)
      expect(survey).toBeTruthy()
      expect(survey.id).toBeTruthy()
      expect(survey.question).toBe('any_question')
    })

    test('Should return null when id is not a valid ObjectId', async () => {
      const sut = makeSut()
      const survey = await sut.loadById('invalid')
      expect(survey).toBeNull()
    })
  })

  describe('checkById()', () => {
    test('Should return true on success', async () => {
      const res = await surveyCollection.insertOne(mockSurveyData())
      const id = res.insertedId.toString()
      const sut = makeSut()
      const survey = await sut.checkById(id)
      expect(survey).toBe(true)
    })

    test('Should return false when id is not a valid ObjectId', async () => {
      const sut = makeSut()
      const survey = await sut.checkById('invalid')
      expect(survey).toBe(false)
    })
  })
})

let accountCollection: Collection
let surveyCollection: Collection
let surveyResultCollection: Collection

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

const makeAccountId = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any@email.com',
    password: 'any_password'
  })
  return res.insertedId.toString()
}
