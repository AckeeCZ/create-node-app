import { Container } from './container.js'

interface BaseContext {
  container: Container
  note?: string
}

export interface ApiUserRequestContext extends BaseContext {
  type: 'api-user'
  user: null // Add UserContext if Auth is implemented
}

export interface ServerRequestContext extends BaseContext {
  type: 'server'
}

/**
 * Defines context in which current application runs.
 * Context should be created with every external call (user request, cli input, ...)
 */
export type RequestContext = ApiUserRequestContext | ServerRequestContext

/**
 * Creator of the context for the App. Every API layer is responsible for
 * creating the context based on the Api parameters (http headers, protocol settings etc...)
 */
export type RequestContextFactory<Params extends any[]> = (
  container: Readonly<Container>,
  ...params: Params
) => Promise<RequestContext>

/**
 * Creator of the server context that should be used only in executions that are invoked
 * on server, f.e. CLI, server start up etc.
 */
export type ServerRequestContextFactory<Params extends any[]> = (
  container: Readonly<Container>,
  ...params: Params
) => Promise<ServerRequestContext>
