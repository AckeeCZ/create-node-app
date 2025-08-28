import assert from 'node:assert'
import { describe, before, test } from 'mocha'
import { createAppServer } from '../view/server.js'
import { gql } from 'graphql-tag'
import { ApolloServer } from '@apollo/server'

describe('Hello world', () => {
  let server: ApolloServer

  before(async () => {
    const { server: appServer } = createAppServer()
    server = appServer
  })

  after(async () => {
    await server.stop()
  })

  test('should return greeting', async () => {
    const query = gql`
      query Hello {
        greeting
      }
    `
    const res = await server.executeOperation({ query })

    assert(res.body.kind === 'single')
    assert.deepStrictEqual(res.body.singleResult.errors, undefined)
    assert.deepStrictEqual(
      res.body.singleResult.data?.greeting,
      'Hello, world! 🎉'
    )
  })
})
