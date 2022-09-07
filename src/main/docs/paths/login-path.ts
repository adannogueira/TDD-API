export const passwordLoginPath = {
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
        $ref: '#/components/badRequest'
      },
      401: {
        $ref: '#/components/unauthorized'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  }
}
