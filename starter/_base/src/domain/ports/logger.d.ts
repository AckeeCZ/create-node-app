export interface LoggerConfig {
  defaultLevel: string
  enablePrettyPrint?: boolean
}

type BaseLoggerFn = (object: any, message?: string) => void

export interface LoggerPort {
  level: string
  debug: BaseLoggerFn
  info: BaseLoggerFn
  warn: BaseLoggerFn
  error: BaseLoggerFn
  fatal: BaseLoggerFn
  trace: BaseLoggerFn
  silent: BaseLoggerFn
}

export interface LoggerFactoryPort {
  create: (config: LoggerConfig) => LoggerPort
}
