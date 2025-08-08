import { safeConfig } from './config.js'
import { createAppServer, startServer } from './view/server.js'
import { createContainer } from './container.js'

const appContainer = createContainer()
const { logger } = appContainer

logger.info({ config: safeConfig }, 'Loaded config')

const appServer = createAppServer()
void startServer({ ...appServer, container: appContainer })
