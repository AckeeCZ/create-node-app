import { ApolloServer } from '@apollo/server'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { resolvers } from './graphql/resolvers.js'
import { config } from '../config.js'
import { schema } from './graphql/schema.js'
import express from 'express'
import { ctrl } from './controller.js'
import { expressMiddleware } from '@as-integrations/express5'
import { Container } from '../container.js'

export const clientSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers,
})

export const createAppServer = () => {
  const app = express()
  app.disable('x-powered-by')

  const server = new ApolloServer({
    schema: clientSchema,
    includeStacktraceInErrorResponses: config.server.allowResponseErrors,
    introspection: config.server.enableIntrospection,
  })

  return { app, server }
}

export async function startServer({
  app,
  server,
  container,
}: ReturnType<typeof createAppServer> & { container: Container }) {
  const { logger } = container

  await server.start()

  app.use('/api/graphql', ctrl.json, expressMiddleware(server))

  app.listen({ port: config.server.port }, () =>
    logger.info({}, `Server started, port=${config.server.port}`)
  )

  return { app, server }
}
