import { DbConnection } from '../domain/ports/database.js'
import knex, { Knex } from 'knex'

export const knexConnection: DbConnection<Knex> = {
  connect: async (connectionString: string) => {
    return knex({
      client: 'pg',
      connection: connectionString,
    })
  },
  disconnect: async (db: Knex) => {
    await db.destroy()
  },
}
