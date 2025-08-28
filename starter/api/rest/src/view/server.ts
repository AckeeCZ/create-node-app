import express from 'express'
import { createRequestLogger } from './rest/middleware/request-logger.js'
import { config } from '../config.js'
import { createErrorHandler } from './rest/middleware/error-handler.js'
import { routes } from './rest/routes.js'
import { createContextMiddleware } from './rest/middleware/context-middleware.js'
import { ContainerFactory } from '../container.js'

export const createServer = async (containerFactory: ContainerFactory) => {
  const container = await containerFactory()
  const { logger } = container

  const server = express()

  const errorHandler = createErrorHandler(config.server)
  const requestLogger = createRequestLogger(logger)
  const contextMiddleware = createContextMiddleware(container)

  server.disable('x-powered-by')

  server.use(requestLogger)
  server.use(contextMiddleware)
  server.use('/api/v1/', routes.api)
  server.use(errorHandler)

  return server
}
