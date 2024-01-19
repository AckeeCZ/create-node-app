import logger from './logger'
import config, { safeConfig } from './config'
import server from './app/server'

logger.info({ config: safeConfig }, 'Loaded config')
server.listen(config.server.port, () => {
  logger.info(`🚀 Server is running on port ${config.server.port}`)
})

export default server
