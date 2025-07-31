import assert from 'node:assert'
import { describe, it, before } from 'mocha'
import request from 'supertest'
import { createServer } from '../view/server.js'
import { createContainer } from '../container.js'
import { components } from '../view/rest/spec/openapi.js'

describe('Health Check API', () => {
  let server: ReturnType<typeof createServer>
  let container: ReturnType<typeof createContainer>

  before(() => {
    container = createContainer()
    server = createServer(container)
  })

  describe('GET /api/v1/healthz', () => {
    it('should return successful health check response', async () => {
      const response = await request(server).get('/api/v1/healthz').expect(200)

      // Type assertion to ensure response matches OpenAPI schema
      const healthResponse: components['schemas']['HealthCheckResponse'] =
        response.body

      assert(healthResponse.status === 0)
    })
  })
})
