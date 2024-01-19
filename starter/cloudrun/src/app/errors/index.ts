import { code } from './errorCode'

export * from './DomainError'

export { code }

export const ERROR_DOMAIN_CODE_TO_HTTP_STATUS: Record<
  keyof typeof code,
  number
> = {
  0: 500,
}
