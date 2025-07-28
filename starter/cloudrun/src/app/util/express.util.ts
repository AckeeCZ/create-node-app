import { pinoHttp, Options } from 'pino-http'
import express from 'express'
import logger from '../../logger.js'
import config from '../../config.js'
import * as errors from '../errors/errorCode.js'
import { DomainError } from '../errors/DomainError.js'

export class Response {
  constructor(public readonly status: number, public readonly data: any) {}
}

function respond(httpResponse: express.Response, appResponse: unknown) {
  if (appResponse instanceof Response) {
    httpResponse.status(appResponse.status)
    if (appResponse.data) {
      ;(httpResponse as any).out = appResponse.data
      httpResponse.json(appResponse.data)
    }
    return
  }
  ;(httpResponse as any).out = appResponse
  httpResponse.json(appResponse)
}

export function requestLogger(innerLogger: typeof logger) {
  const options: Options = {
    logger: innerLogger,
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

function errorToProductionObject<T extends Error>(error: T) {
  if (error instanceof DomainError) {
    return {
      ...error.data,
      code: error.code,
    }
  }
  return {}
}

function errorToDevObject<T extends Error>(error: T) {
  if (error instanceof DomainError) {
    return {
      ...error.data,
      message: error.message,
      stack: error.stack,
    }
  }
  return {
    message: error.message,
    stack: error.stack,
  }
}

export function errorController(): express.ErrorRequestHandler {
  return (error, _req, res, _next) => {
    const statusCode =
      error instanceof DomainError
        ? errors.ERROR_DOMAIN_CODE_TO_HTTP_STATUS[error.code] ?? 500
        : 500
    ;(res as any).error = {
      ...errorToProductionObject(error),
      ...errorToDevObject(error),
    }
    respond(
      res,
      new Response(
        statusCode,
        config.server.enableProductionHttpErrorResponses
          ? errorToProductionObject(error)
          : {
              ...errorToProductionObject(error),
              ...errorToDevObject(error),
            }
      )
    )
  }
}
