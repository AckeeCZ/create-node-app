import logger from './logger.js'
import config, { safeConfig } from './config.js'
import server from './app/server.js'

logger.info({ config: safeConfig }, 'Loaded config')
server.listen(config.server.port, () => {
  logger.info(`🚀 Server is running on port ${config.server.port}`)
})

export default server
