import { logger } from './logger.js'
import { safeConfig } from './config.js'
import { createAppServer, startServer } from './app/server.js'

logger.info({ config: safeConfig }, 'Loaded config')

const appServer = createAppServer()
void startServer(appServer)
