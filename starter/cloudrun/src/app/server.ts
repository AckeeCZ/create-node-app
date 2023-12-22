import express from 'express'
import * as util from './util'
import logger from '../logger'

const server = express()

server.use(util.express.requestLogger(logger))

server.get('/', (res: express.Response) => {
  res.send('🎉 Hi :)')
})

server.use(util.express.errorController())

export default server
