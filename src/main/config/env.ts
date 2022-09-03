export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://mongo:27017/clean-node-api',
  port: +process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'secret',
  accessTokenExpiration: process.env.JWT_EXPIRATION || '1h',
  refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION || '1d'
}
