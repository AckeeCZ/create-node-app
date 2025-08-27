import { config } from './config.js'
import { pinoLoggerFactory } from './adapters/pino.logger.js'
import { LoggerPort } from './domain/ports/logger.d.js'

export interface Container {
  logger: LoggerPort
}

export type ContainerFactory = () => Promise<Container>

export const createContainer: ContainerFactory = async () => {
  const logger = pinoLoggerFactory.create(config.logger)

  return {
    logger,
  }
}
