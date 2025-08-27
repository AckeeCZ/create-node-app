import { createLoader, maskedValues, values } from 'configuru'

const loader = createLoader({
  defaultConfigPath: '.env.jsonc',
})

const configSchema = {
  server: {
    port: loader.number('SERVER_PORT'),
    enableProductionHttpErrorResponses: loader.bool(
      'ENABLE_PRODUCTION_HTTP_ERROR_RESPONSES'
    ),
  },
}

export const config = values(configSchema)
export const safeConfig = maskedValues(configSchema)
