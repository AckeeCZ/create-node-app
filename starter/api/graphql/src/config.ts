import { createLoader, maskedValues, values } from 'configuru'
import { Level } from 'pino'

const loader = createLoader({
  defaultConfigPath: '.env.jsonc',
})

const configSchema = {
  server: {
    port: loader.number('SERVER_PORT'),
    allowResponseErrors: loader.bool('SERVER_ALLOW_RESPONSE_ERRORS'),
    enableIntrospection: loader.bool('SERVER_ENABLE_INTROSPECTION'),
  },
}

export const config = values(configSchema)
export const safeConfig = maskedValues(configSchema)
