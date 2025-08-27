import { config, safeConfig } from './config.js'
import { createAppServer, startServer } from './view/server.js'
import { pinoLoggerFactory } from './adapters/pino.logger.js'
import { createContainer } from './container.js'

const logger = pinoLoggerFactory.create(config.logger)

logger.info({ config: safeConfig }, 'Loaded config')

const appServer = createAppServer()
void startServer({ ...appServer, logger, containerFactory: createContainer })
