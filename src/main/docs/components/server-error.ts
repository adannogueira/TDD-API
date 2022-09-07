export const serverError = {
  description: 'Unexpected Server Error',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}
