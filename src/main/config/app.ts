import setupSwagger from './swagger'
import setupMiddlewares from './middlewares'
import setupStaticFiles from './static-files'
import setupRoutes from './routes'
import express, { Express } from 'express'
import { setupApolloServer } from './apollo-server'

export const setupApp = async (): Promise<Express> => {
  const app = express()
  setupStaticFiles(app)
  setupSwagger(app)
  setupMiddlewares(app)
  setupRoutes(app)
  const server = setupApolloServer()
  await server.start()
  server.applyMiddleware({ app })
  return app
}
