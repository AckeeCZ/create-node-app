import {
  Migration,
  MigrationRepository,
} from '../../domain/ports/repositories/migration.repository.js'
import { Knex } from 'knex'

const TABLE = 'knex_migrations'

const mapMigrationToDomain = (migration: any): Migration => {
  return {
    id: migration.id,
    name: migration.name,
    executedAt: migration.migration_time,
  }
}

export const createMigrationsRepository: (knex: Knex) => MigrationRepository = (
  knex: Knex
) => ({
  list: async () => {
    const migrations = await knex.select('*').from(TABLE)
    return migrations.map(mapMigrationToDomain)
  },
})
