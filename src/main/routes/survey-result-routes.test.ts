import app from '$/main/config/app'
import request from 'supertest'

describe('Survey Result Routes', () => {
  describe('[PUT] /surveys/:surveyId/results', () => {
    test('Should return 403 when user is not authorized', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({
          answer: 'any_answer'
        })
        .expect(403)
    })
  })
})
