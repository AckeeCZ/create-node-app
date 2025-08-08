import { ErrorCode, errorMessages } from './codes.js'

export class DomainError<AdditionalData = any> extends Error {
  constructor(
    public readonly code: ErrorCode,
    public readonly message: string = errorMessages[code],
    public readonly data?: AdditionalData
  ) {
    super(message)
  }
}

export type ValidationErrorData =
  | Array<{ field: string; message: string }>
  | { field: string; message: string }

export class ValidationError extends DomainError<ValidationErrorData> {
  constructor(errors: ValidationErrorData) {
    super(
      ErrorCode.VALIDATION,
      errorMessages[ErrorCode.VALIDATION],
      Array.isArray(errors) ? errors : [errors]
    )
  }
}
