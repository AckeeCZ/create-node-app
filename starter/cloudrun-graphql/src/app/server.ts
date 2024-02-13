import { ApolloServer } from '@apollo/server'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { applyMiddleware } from 'graphql-middleware'
import { resolvers } from './api/graphql/resolvers'
import config from '../config'
import { schema } from './api/graphql/schema'
import express from 'express'
import { ctrl } from './controller'
import { expressMiddleware } from '@apollo/server/express4'
import logger from '../logger'

export const clientSchema = applyMiddleware(
  makeExecutableSchema({
    typeDefs: schema,
    resolvers,
  })
)

export const createAppServer = () => {
  const app = express()

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
}: ReturnType<typeof createAppServer>) {
  await server.start()

  app.use('/api/graphql', ctrl.json, expressMiddleware(server))

  app.listen({ port: config.server.port }, () =>
    logger.info({}, `Server started, port=${config.server.port}`)
  )

  return { app, server }
}
