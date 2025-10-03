export enum ErrorCode {
  UNKNOWN = 0,
  VALIDATION = 1000,
}

export const errorMessages = {
  [ErrorCode.UNKNOWN]: 'Unknown error',
  [ErrorCode.VALIDATION]: 'Validation error',
}
