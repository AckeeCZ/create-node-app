import { ErrorCode } from '../../../domain/errors/codes.js'
import { DomainError } from '../../../domain/errors/errors.js'
import express from 'express'

export interface ErrorHandlerConfig {
  enableProductionHttpErrorResponses: boolean
}

const ERROR_DOMAIN_CODE_TO_HTTP_STATUS: Record<ErrorCode, number> = {
  [ErrorCode.UNKNOWN]: 500,
  [ErrorCode.VALIDATION]: 422,
}

const errorToProductionObject = <T extends Error>(error: T) => {
  if (error instanceof DomainError) {
    return {
      ...error.data,
      code: error.code,
    }
  }
  return {}
}

const errorToDevObject = <T extends Error>(error: T) => {
  if (error instanceof DomainError) {
    return {
      ...error.data,
      code: error.code,
      message: error.message,
      stack: error.stack,
    }
  }
  return {
    message: error.message,
    stack: error.stack,
  }
}

export function createErrorHandler(
  config: ErrorHandlerConfig
): express.ErrorRequestHandler {
  return (error, _req, res, _next) => {
    const statusCode =
      error instanceof DomainError
        ? (ERROR_DOMAIN_CODE_TO_HTTP_STATUS[error.code] ?? 500)
        : 500

    ;(res as any).error = errorToDevObject(error)

    const mappedError = config.enableProductionHttpErrorResponses
      ? errorToProductionObject(error)
      : errorToDevObject(error)

    res.status(statusCode)
    if (mappedError) {
      ;(res as any).out = mappedError
      res.json(mappedError)
    }
  }
}
