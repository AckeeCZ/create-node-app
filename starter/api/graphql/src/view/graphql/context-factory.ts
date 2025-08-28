import { RequestContext } from '../../context.js'
import { ContainerFactory } from '../../container.js'

export const contextFactory = async (
  containerFactory: ContainerFactory
): Promise<RequestContext> => {
  const container = await containerFactory()
  return {
    type: 'api-user',
    container,
    user: null, // Add UserContext if Auth is implemented
  }
}
