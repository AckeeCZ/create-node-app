import { Result } from 'node-healthz'
import { components } from '../spec/openapi.js'
import { ctrl } from '../util/openapi.util.js'

export enum Status {
  Healthy,
  Unhealthy,
}

const mapHealthCheckToApi = (
  healthCheck: Result
): components['schemas']['HealthCheckResponse'] => {
  return {
    status: healthCheck.status,
    checks: healthCheck.checks.map(check => ({
      id: check.id,
      status: check.status,
      output: String(check.output),
      required: check.required,
      latency: check.latency,
      latencyStatus: check.latencyStatus,
    })),
  }
}

export const healthCheckController = ctrl.createRestController({
  healthz: async ctx => {
    const { healthCheckService } = ctx.container

    const healthCheck = await healthCheckService.check()
    return mapHealthCheckToApi(healthCheck)
  },
})
