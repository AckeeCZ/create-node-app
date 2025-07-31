import { config } from './config.js'
import { createContainer } from './container.js'
import { createServer } from './view/server.js'

const appContainer = createContainer()
const { logger } = appContainer

const server = createServer(appContainer)

server.listen(config.server.port, () => {
  logger.info(
    { port: config.server.port },
    `🚀 Server is running on port ${config.server.port}`
  )
})

export default server
