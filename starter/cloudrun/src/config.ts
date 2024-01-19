import { createLoader, safeValues, values } from 'configuru'
import { Level } from 'pino'

const loader = createLoader({
  defaultConfigPath: '.env.jsonc',
})

const configSchema = {
  logger: {
    defaultLevel: loader.custom(x => x as Level)('LOGGER_DEFAULT_LEVEL'),
    pretty: loader.bool('LOGGER_PRETTY'),
  },
  server: {
    port: loader.number('SERVER_PORT'),
    enableProductionHttpErrorResponses: loader.bool(
      'ENABLE_PRODUCTION_HTTP_ERROR_RESPONSES'
    ),
  },
}

export default values(configSchema)
export const safeConfig = safeValues(configSchema)
