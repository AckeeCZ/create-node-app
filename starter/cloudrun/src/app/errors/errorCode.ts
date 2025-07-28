export const code = {
  0: {
    code: '0',
    message: 'Unknown error',
  },
} satisfies { [key: string]: { code: string; message: string } }

export const ERROR_DOMAIN_CODE_TO_HTTP_STATUS: Record<
  keyof typeof code,
  number
> = {
  0: 500,
}
