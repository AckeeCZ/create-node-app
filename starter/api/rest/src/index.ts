import { config } from './config.js'
import { createServer } from './view/server.js'
import { pinoLoggerFactory } from './adapters/pino.logger.js'
import { createContainer } from './container.js'

const logger = pinoLoggerFactory.create(config.logger)

const server = await createServer(createContainer)

server.listen(config.server.port, () => {
  logger.info(
    { port: config.server.port },
    `🚀 Server is running on port ${config.server.port}`
  )
})

export default server
