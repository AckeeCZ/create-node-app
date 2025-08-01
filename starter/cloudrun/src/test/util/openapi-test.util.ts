import supertest from 'supertest'
import {
  OpenApiRoutePathParam,
  OpenApiRouteQueryParam,
  OpenApiRouteRequestBody,
  OpenApiRouteResponseBody,
} from '../../view/rest/util/openapi.util.js'
import * as openapi from '../../view/rest/spec/openapi.js'
import type { Express } from 'express'

export const request = (server: Express) => supertest(server)

type KeysOfUnion<T> = T extends T ? keyof T : never

export type Response<TBody> = Omit<
  Awaited<ReturnType<ReturnType<typeof request>['get']>>,
  'body'
> & { body: TBody }

export const requestTyped = <
  Resource extends KeysOfUnion<openapi.paths>,
  Method extends Exclude<KeysOfUnion<openapi.paths[Resource]>, 'parameters'>,
  Resp extends OpenApiRouteResponseBody<Openapi[Resource], Method>,
  Openapi extends openapi.paths = openapi.paths
>(
  server: Express,
  resource: Resource,
  method: Method,
  routeParams?: OpenApiRoutePathParam<Openapi[Resource]>,
  queryParams?: OpenApiRouteQueryParam<Openapi[Resource]>
) => {
  const replacedResource = Object.keys(
    (routeParams ?? {}) as Record<string, string>
  ).reduce((resource, param) => {
    return resource.replace(
      // eslint-disable-next-line security/detect-non-literal-regexp
      new RegExp(`{${param}}`, 'g'),
      (routeParams as Record<string, string>)[param]
    )
  }, resource)

  const url = new URL('https://ackee.cz')
  Object.entries(queryParams ?? {}).forEach(([key, val]) => {
    if (val !== undefined && val !== null) {
      url.searchParams.set(key, val.toString())
    }
  })

  const req = request(server)[method](
    replacedResource + '?' + url.searchParams.toString()
  )
  const originalSend = req.send.bind(req)
  const enhanced = Object.assign(req, {
    sendTyped(
      body?: OpenApiRouteRequestBody<Openapi[Resource], Method>,
      headers?: Record<string, string>
    ) {
      if (headers) {
        Object.entries(headers).forEach(([key, value]) => {
          void req.set(key, value)
        })
      }
      void originalSend(body as any)
      return enhanced
    },
    responseTyped: () => {
      return req as Promise<Response<Resp>>
    },
  })
  return enhanced
}
