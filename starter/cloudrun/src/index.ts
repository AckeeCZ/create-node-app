import logger from './logger'
import { safeConfig } from './config'

logger.info({ config: safeConfig }, 'Loaded config')

logger.info('Hello world!')
