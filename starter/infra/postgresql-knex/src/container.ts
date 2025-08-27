import { config } from './config.js'
import { DbConnection } from './domain/ports/database.js'
import { Knex } from 'knex'
import { MigrationRepository } from './domain/ports/repositories/migration.repository.js'
import { knexConnection } from './adapters/knex.database.js'
import { createMigrationsRepository } from './adapters/repositories/migration.repository.js'

export interface Container {
  database: DbConnection<Knex>
  repositories: {
    migrations: MigrationRepository
  }
}

export const createContainer = async (): Promise<Container> => {
  const db = await knexConnection.connect(config.db.connectionString)

  return {
    database: knexConnection,
    repositories: {
      migrations: createMigrationsRepository(db),
    },
  }
}
