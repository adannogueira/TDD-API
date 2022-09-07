export const accountSchema = {
  type: 'object',
  properties: {
    accessToken: {
      type: 'string'
    },
    refreshToken: {
      type: 'string'
    }
  }
}
