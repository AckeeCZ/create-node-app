import * as healthz from 'node-healthz'

export const healthCheckService = {
  check: async (): Promise<healthz.Result> => {
    return await healthz.check({
      checks: [
        {
          id: 'Server',
          required: true,
          fn: () => Promise.resolve('OK'),
        },
      ],
    })
  },
}
