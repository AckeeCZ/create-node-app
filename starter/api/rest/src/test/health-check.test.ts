import assert from 'node:assert'
import { describe, it, before } from 'mocha'
import { createServer } from '../view/server.js'
import { createContainer } from '../container.js'
import { requestTyped } from './util/openapi-test.util.js'

describe('Health Check API', () => {
  let server: Awaited<ReturnType<typeof createServer>>

  before(async () => {
    server = await createServer(createContainer)
  })

  describe('GET /api/v1/healthz', () => {
    it('should return successful health check response', async () => {
      const response = await requestTyped(server, '/api/v1/healthz', 'get')
        .sendTyped()
        .expect(200)
        .responseTyped()
      assert.equal(response.body.status, 0)
    })
  })
})
