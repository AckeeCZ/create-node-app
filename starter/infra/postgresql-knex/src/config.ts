import { createLoader, maskedValues, values } from 'configuru'

const loader = createLoader({
  defaultConfigPath: '.env.jsonc',
})

const configSchema = {
  db: {
    connectionString: loader.string('DB_CONNECTION_STRING'),
  },
}

export const config = values(configSchema)
export const safeConfig = maskedValues(configSchema)
