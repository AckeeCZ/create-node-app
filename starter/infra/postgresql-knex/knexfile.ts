import { config } from './src/config.js'

module.exports = {
  client: 'pg',
  connection: config.db.connectionString,
  migrations: {
    directory: './src/db/migrations',
    stub: './src/db/migration.template.ts',
    extension: 'ts',
  },
  seeds: {
    directory: './src/db/seeds',
    stub: './src/db/seed.template.ts',
    extension: 'ts',
  },
}
