export const surveyPath = {
  get: {
    security: [{
      authorization: []
    }],
    tags: ['Surveys'],
    summary: 'API de listagem de enquetes',
    responses: {
      200: {
        description: 'OK',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveys'
            }
          }
        }
      },
      403: {
        $ref: '#/components/forbidden'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  },
  post: {
    security: [{
      authorization: []
    }],
    tags: ['Surveys'],
    summary: 'API criação de enquetes',
    requestBody: {
      description: 'dados de uma enquete',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/addSurvey'
          }
        }
      }
    },
    responses: {
      204: {
        description: 'OK'
      },
      403: {
        $ref: '#/components/forbidden'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  }
}
