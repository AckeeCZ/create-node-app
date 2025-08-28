import { pinoHttp, Options } from 'pino-http'
import { LoggerPort } from '../../../domain/ports/logger.d.js'

export function createRequestLogger(innerLogger: LoggerPort) {
  const options: Options = {
    logger: innerLogger as any,
    serializers: {
      res: res => {
        res.error = res.raw.error
        res.out = res.raw.out
        return res
      },
      req: req => {
        req.body = req.raw.body
        return req
      },
    },
    customReceivedMessage: (req, _res) =>
      `--- ${String(req.method)} ${String(req.url)} - Request accepted`,
    customSuccessMessage: (req, res) =>
      `${res.statusCode} ${String(req.method)} ${String(
        req.url
      )} - Standard output`,
    customErrorMessage: (req, res, _error) =>
      `${res.statusCode} ${String(req.method)} ${String(req.url)} - ${
        res.statusMessage
      }`,
    customErrorObject: (_req, res, _error, val) => ({
      ...val,
      error: (res as any).error,
    }),
    customAttributeKeys: {
      err: 'error',
    },
  }
  return pinoHttp(options)
}
