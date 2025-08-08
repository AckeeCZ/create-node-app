import { config } from './config.js'
import { pinoLoggerFactory } from './adapters/pino.logger.js'
import { LoggerPort } from './domain/ports/logger.d.js'

export interface Container {
  logger: LoggerPort
}

export const createContainer = (): Container => {
  const logger = pinoLoggerFactory.create(config.logger)

  return {
    logger,
  }
}
