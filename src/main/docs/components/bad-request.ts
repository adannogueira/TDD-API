export const badRequest = {
  description: 'Invalid Request Data',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}
