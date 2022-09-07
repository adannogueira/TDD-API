export const loginPath = {
  post: {
    tags: ['PasswordLogin'],
    summary: 'API de autenticação de usuário via email e senha',
    requestBody: {
      description: 'email e senha',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/passwordLogin'
          }
        }
      }
    },
    responses: {
      200: {
        description: 'OK',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/account'
            }
          }
        }
      },
      400: {
        description: 'Bad Request'
      },
      401: {
        description: 'Unauthorized'
      },
      500: {
        description: 'Server Error'
      }
    }
  }
}
