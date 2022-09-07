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
  }
}
