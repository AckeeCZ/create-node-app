import { knexConnection } from './knex.database.js'
import { config } from '../config.js'
import { describe, test } from 'mocha'
import assert from 'node:assert'
import { Knex } from 'knex'

describe('knexConnection', () => {
  test('connects to PostgreSQL and prints version', async () => {
    let db: Knex | undefined

    await assert.doesNotReject(
      knexConnection.connect(config.db.connectionString).then(connection => {
        db = connection
      })
    )
    assert(db)
    await assert.doesNotReject(db.raw('SELECT version()'))
    await assert.doesNotReject(knexConnection.disconnect(db))
  })
})
