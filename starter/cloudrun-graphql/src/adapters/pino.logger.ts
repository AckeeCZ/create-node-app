import { pino as pinoLogger } from 'pino'
import { LoggerFactoryPort } from '../domain/ports/logger.d.js'

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
})

export const pinoLoggerFactory: LoggerFactoryPort = {
  create: config => {
    return pinoLogger({
      ...defaultPinoConf(config.defaultLevel),
      transport: config.enablePrettyPrint
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
            },
          }
        : undefined,
      level: config.defaultLevel,
    })
  },
}
