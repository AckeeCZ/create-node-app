import express from 'express'
import { requestLogger, errorController } from './util/express.util.js'
import logger from '../logger.js'

const server = express()

server.disable('x-powered-by')

server.use(requestLogger(logger))

server.get('/', (_req: express.Request, res: express.Response) => {
  res.send('🎉 Hi :)')
})

server.use(errorController())

export default server
