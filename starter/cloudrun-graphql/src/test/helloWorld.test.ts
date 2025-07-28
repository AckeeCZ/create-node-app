import assert from 'node:assert'
import { describe, it } from 'mocha'
import { createAppServer } from '../app/server.js'
import { gql } from 'graphql-tag'

describe('Hello world', () => {
  it('should return greeting', async () => {
    const query = gql`
      query Hello {
        greeting
      }
    `
    const { server } = createAppServer()
    const res = await server.executeOperation({ query })

    assert(res.body.kind === 'single')
    assert.deepStrictEqual(res.body.singleResult.errors, undefined)
    assert.deepStrictEqual(
      res.body.singleResult.data?.greeting,
      'Hello, world! 🎉'
    )
  })
})
