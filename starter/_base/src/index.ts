import { createContainer } from './container.js'
import { RequestContext } from './context.js'

const entrypoint = async () => {
  const ctx: RequestContext = {
    container: await createContainer(),
    type: 'api-user',
    user: null,
  }

  ctx.container.logger.info('Hello World! 🎉')
}

void entrypoint()
