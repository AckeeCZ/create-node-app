import logger from 'pino'
import config from './config'

// https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#logseverity
const PinoLevelToSeverityLookup: Record<string, string> = {
  trace: 'DEBUG',
  debug: 'DEBUG',
  info: 'INFO',
  warn: 'WARNING',
  error: 'ERROR',
  fatal: 'CRITICAL',
} as const

const defaultPinoConf = (defaultLevel: string) => ({
  messageKey: 'message',
  formatters: {
    messageKey: 'message',
    level: (label: string, num: number) => {
      return {
        severity:
          PinoLevelToSeverityLookup[label] ??
          PinoLevelToSeverityLookup[defaultLevel],
        level: num,
      }
    },
  },
  serializers: {
    error: logger.stdSerializers.err,
  },
})

export default logger({
  ...defaultPinoConf(config.logger.defaultLevel),
  transport: config.logger.pretty
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      }
    : undefined,
  level: config.logger.defaultLevel,
})
