import { createLoader, safeValues, values } from 'configuru'
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
  logger: {
    defaultLevel: loader.custom(x => x as Level)('LOGGER_DEFAULT_LEVEL'),
    pretty: loader.bool('LOGGER_PRETTY'),
  },
}

export default values(configSchema)
export const safeConfig = safeValues(configSchema)
