import * as errorCode from './errorCode.js'

export class DomainError<AdditionalData = any> extends Error {
  constructor(
    public readonly code: keyof typeof errorCode.code,
    public readonly data?: AdditionalData
  ) {
    super((errorCode.code[code] ?? errorCode.code[0]).message)
  }
}
