import { knexConnection } from '../adapters/knex.database.js'
import { config } from '../config.js'
import { Knex } from 'knex'
import { before, after } from 'mocha'

let db: Knex

before(async () => {
  db = await knexConnection.connect(config.db.connectionString)
})

after(async () => {
  if (db) {
    await knexConnection.disconnect(db)
  }
})
