import { config } from './config.js'
import { pinoLoggerFactory } from './adapters/pino.logger.js'
import { LoggerPort } from './domain/ports/logger.d.js'
import { healthCheckService } from './domain/health-check.service.js'

export interface Container {
  logger: LoggerPort
  healthCheckService: typeof healthCheckService
}

export const createContainer = (): Container => {
  const logger = pinoLoggerFactory.create(config.logger)

  return {
    logger,
    healthCheckService,
  }
}
