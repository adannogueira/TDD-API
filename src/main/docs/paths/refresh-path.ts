export const refreshPath = {
  post: {
    security: [{
      authorization: []
    }],
    tags: ['Login'],
    summary: 'API de autenticação de usuário via refresh token',
    description: 'Login via refresh token só pode ser utilizado quando o access token expira, ambos os tokens devem ser enviados',
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
      401: {
        $ref: '#/components/unauthorized'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  }
}
