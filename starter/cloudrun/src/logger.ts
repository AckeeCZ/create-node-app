import logger from 'pino'
import config from './config'

export default logger({
  transport: config.logger.pretty
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      }
    : undefined,
  level: config.logger.level,
})
