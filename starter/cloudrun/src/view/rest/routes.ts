import express from 'express'
import { openApiRouter, registerOpenApiRoutes } from './util/openapi.util.js'
import { healthCheckController } from './controller/health-check.controller.js'

const apiRouter = openApiRouter(express.Router(), {
  removePrefix: '/api/v1/',
})

registerOpenApiRoutes(apiRouter, {
  ...healthCheckController,
})

export const routes = {
  api: apiRouter.express,
}
