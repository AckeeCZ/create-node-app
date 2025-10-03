import { Knex } from 'knex'
import { knexConnection } from './adapters/knex.database.js'
import { createMigrationsRepository } from './adapters/repositories/migration.repository.js'
import { config } from './config.js'
import { MigrationRepository } from './domain/ports/repositories/migration.repository.js'

export interface Container {
  database: Knex
  repositories: {
    migrations: MigrationRepository
  }
}

export const createContainer = async (): Promise<Container> => {
  const database = await knexConnection.connect(config.db.connectionString)

  return {
    database,
    repositories: {
      migrations: createMigrationsRepository(database),
    },
  }
}
