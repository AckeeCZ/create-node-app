import * as db from './src/app/database'

module.exports = {
  ...db.knexConfig,
  migrations: {
    directory: './src/db-migrations',
    stub: './src/config/db-migration.template.ts',
    extension: 'ts',
  },
  seeds: {
    directory: './src/db-seeds',
    stub: './src/config/db-seed.template.ts',
    extension: 'ts',
  },
}
