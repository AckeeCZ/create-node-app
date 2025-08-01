import express from 'express'
import { createRequestLogger } from './rest/middleware/request-logger.js'
import { Container } from '../container.js'
import { config } from '../config.js'
import { createErrorHandler } from './rest/middleware/error-handler.js'
import { routes } from './rest/routes.js'
import { createContextMiddleware } from './rest/middleware/context-middleware.js'

export const createServer = (appContainer: Container) => {
  const { logger } = appContainer

  const server = express()
  const errorHandler = createErrorHandler(config.server)
  const requestLogger = createRequestLogger(logger)
  const contextMiddleware = createContextMiddleware(appContainer)

  server.disable('x-powered-by')

  server.use(requestLogger)
  server.use(contextMiddleware)
  server.use('/api/v1/', routes.api)
  server.use(errorHandler)

  return server
}
