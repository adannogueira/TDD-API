import { LoadSurveyResultRepository } from '$/data/protocols/db/survey-result/load-survey-result-repository'
import { SaveSurveyResultRepository } from '$/data/protocols/db/survey-result/save-survey-result-repository'
import { SurveyAnswerModel } from '$/domain/models/survey-result'
import { MongoHelper, QueryBuilder } from '../helpers'
import { ObjectId } from 'mongodb'
import { SurveyModel } from '$/domain/models/survey'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository, LoadSurveyResultRepository {
  async save ({ surveyId, accountId, answer, date }: SaveSurveyResultRepository.Params): Promise<void> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.findOneAndUpdate({
      surveyId: new ObjectId(surveyId),
      accountId: new ObjectId(accountId)
    }, {
      $set: { answer, date }
    }, {
      upsert: true
    })
  }

  async loadBySurveyId (surveyId: string, accountId: string): Promise<LoadSurveyResultRepository.Result> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    const [survey, surveyResults]: any[] = await Promise.all([
      surveyCollection.findOne({ _id: new ObjectId(surveyId) }),
      surveyResultCollection.find({ surveyId: new ObjectId(surveyId) }).toArray()
    ])
    const answers = this.calculateAnswers(survey, surveyResults, accountId)
    return {
      surveyId,
      question: survey.question,
      date: survey.date,
      answers: answers.sort((a, b) => b.percent - a.percent)
    }
  }

  async loadBySurveyIdDeprecated (surveyId: string): Promise<LoadSurveyResultRepository.Result> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    const query = new QueryBuilder()
      .match({
        surveyId: new ObjectId(surveyId)
      })
      .group({
        _id: 0,
        data: {
          $push: '$$ROOT'
        },
        total: {
          $sum: 1
        }
      })
      .unwind({
        path: '$data'
      })
      .lookup({
        from: 'surveys',
        localField: 'data.surveyId',
        foreignField: '_id',
        as: 'survey'
      })
      .unwind({
        path: '$survey'
      })
      .group({
        _id: {
          surveyId: '$survey._id',
          question: '$survey.question',
          date: '$survey.date',
          total: '$total',
          answer: '$data.answer',
          answers: '$survey.answers'
        },
        count: {
          $sum: 1
        }
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answers: {
          $map: {
            input: '$_id.answers',
            as: 'item',
            in: {
              $mergeObjects: [
                '$$item',
                {
                  count: {
                    $cond: {
                      if: {
                        $eq: [
                          '$$item.answer',
                          '$_id.answer'
                        ]
                      },
                      then: '$count',
                      else: 0
                    }
                  },
                  percent: {
                    $cond: {
                      if: {
                        $eq: [
                          '$$item.answer',
                          '$_id.answer'
                        ]
                      },
                      then: {
                        $multiply: [
                          {
                            $divide: [
                              '$count',
                              '$_id.total'
                            ]
                          },
                          100
                        ]
                      },
                      else: 0
                    }
                  }
                }
              ]
            }
          }
        }
      })
      .group({
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          date: '$date'
        },
        answers: {
          $push: '$answers'
        }
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answers: {
          $reduce: {
            input: '$answers',
            initialValue: [],
            in: {
              $concatArrays: [
                '$$value',
                '$$this'
              ]
            }
          }
        }
      })
      .unwind({
        path: '$answers'
      })
      .group({
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          date: '$date',
          answer: '$answers.answer',
          image: '$answers.image'
        },
        count: {
          $sum: '$answers.count'
        },
        percent: {
          $sum: '$answers.percent'
        }
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answer: {
          answer: '$_id.answer',
          image: '$_id.image',
          count: '$count',
          percent: '$percent'
        }
      })
      .sort({
        'answer.count': -1
      })
      .group({
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          date: '$date'
        },
        answers: {
          $push: '$answer'
        }
      })
      .project({
        _id: 0,
        surveyId: {
          $toString: '$_id.surveyId'
        },
        question: '$_id.question',
        date: '$_id.date',
        answers: '$answers'
      })
      .build()
    const surveyResult = await surveyResultCollection.aggregate(query).toArray()
    return surveyResult.shift() as LoadSurveyResultRepository.Result
  }

  private calculateAnswers (
    survey: SurveyModel,
    surveyResults: SaveSurveyResultRepository.Params[],
    accountId: string
  ): SurveyAnswerModel[] {
    return survey.answers
      .reduce((end: SurveyAnswerModel[], answer: { image: string, answer: string }) => {
        const count = surveyResults.filter(result => result.answer === answer.answer).length
        const percent = Math.round(100 * count / surveyResults.length) || 0
        const isCurrentAccountAnswer = surveyResults.some(result => {
          return result.accountId.toString() === accountId && result.answer === answer.answer
        })
        const currentResult = {
          image: answer.image,
          answer: answer.answer,
          count,
          percent,
          isCurrentAccountAnswer
        }
        end.push(currentResult)
        return end
      }, [])
  }
}
