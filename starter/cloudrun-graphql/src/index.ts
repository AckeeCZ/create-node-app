import logger from './logger'
import { safeConfig } from './config'
import { createAppServer, startServer } from './app/server'

logger.info({ config: safeConfig }, 'Loaded config')

const appServer = createAppServer()
void startServer(appServer)
