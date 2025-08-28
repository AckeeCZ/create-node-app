import { Knex } from 'knex'

export const up = (knex: Knex) => knex
export const down = () => Promise.resolve(/* no-op */)
