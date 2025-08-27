import { healthCheckService } from './domain/health-check.service.js'

export interface Container {
  healthCheckService: typeof healthCheckService
}

export type ContainerFactory = () => Promise<Container>

export const createContainer: ContainerFactory = async () => {
  return {
    healthCheckService,
  }
}
