import express from 'express'
import bodyParser from 'body-parser'
import { operations, paths, operationPaths } from '../spec/openapi.js'
import { RequestContext } from '../../../context.js'

export type OpenApiRouteResponseBodyMethod<
  T,
  TMethod extends string = 'get',
  TDefault = unknown,
> = T extends {
  [key in TMethod]: {
    responses: { 200: { content: { 'application/json': infer U } } }
  }
}
  ? U
  : TDefault

export type OpenApiRouteResponseBody<
  T,
  TMethod extends string = 'get',
> = OpenApiRouteResponseBodyMethod<
  T,
  TMethod,
  OpenApiRouteResponseBodyMethod<
    T,
    'post',
    OpenApiRouteResponseBodyMethod<
      T,
      'put',
      OpenApiRouteResponseBodyMethod<T, 'delete'>
    >
  >
>

type LowercaseKeys<T extends Record<keyof any, any>> = {
  [key in keyof T as key extends string ? Lowercase<key> : key]: T[key]
}

export type OpenApiRoutePathParam<T> = T extends {
  get: { parameters: { path: infer U } }
}
  ? U
  : T extends { post: { parameters: { path: infer U } } }
    ? U
    : T extends { put: { parameters: { path: infer U } } }
      ? U
      : unknown

export type OpenApiRouteQueryParam<T> = T extends {
  get: { parameters: { query: infer U } }
}
  ? U
  : T extends { post: { parameters: { query: infer U } } }
    ? U
    : unknown

export type OpenApiRouteHeaderParam<T> = T extends {
  get: {
    parameters: {
      header: infer U extends Record<string | number | symbol, any>
    }
  }
}
  ? LowercaseKeys<U>
  : T extends {
        post: {
          parameters: {
            header: infer U extends Record<string | number | symbol, any>
          }
        }
      }
    ? LowercaseKeys<U>
    : unknown

export type OpenApiRouteParam<T> = OpenApiRoutePathParam<T> &
  OpenApiRouteQueryParam<T> &
  OpenApiRouteHeaderParam<T>

export type OpenApiRouteRequestBodyMethod<
  T,
  TMethod extends string = 'post',
  TDefault = unknown,
> = T extends {
  [key in TMethod]: {
    requestBody: {
      content:
        | { 'application/json': infer U }
        | { 'multipart/form-data': infer U }
    }
  }
}
  ? U
  : TDefault

export type OpenApiRouteRequestBody<
  T,
  TMethod extends string = 'post',
> = OpenApiRouteRequestBodyMethod<
  T,
  TMethod,
  OpenApiRouteRequestBodyMethod<
    T,
    'put',
    OpenApiRouteRequestBodyMethod<
      T,
      'delete',
      OpenApiRouteRequestBodyMethod<T, 'patch'>
    >
  >
>

/**
 * pipeMiddleware takes multiple middlewares and creates and merges them into
 * one using express Router.
 */
export const pipeMiddleware = (...middlewares: express.RequestHandler[]) => {
  const router = express.Router({ mergeParams: true })
  middlewares.forEach(m => router.use(m))
  return router
}

export type ApiHandler<TRes> = (
  ctx: Readonly<RequestContext>,
  req: express.Request,
  res: express.Response
) => TRes | Promise<TRes>

const asyncHandler =
  <TRes>(fn: ApiHandler<TRes>, operationId?: OperationIds): express.Handler =>
  async (req, res, next) => {
    try {
      if (operationId) {
        const metadata = operationPaths[operationId]
        if (metadata?.successStatus) {
          res.status(metadata.successStatus)
        }
      }

      const result = await fn(req.context, req, res)

      if (!res.headersSent) {
        if (result != undefined) {
          res.json(result)
        } else {
          res.end()
        }
      }
    } catch (error: unknown) {
      next(error)
    }
  }

export type OperationIds = keyof operations

type ApiMimeTypes = string

type Content = {
  content: any
}

type MimeContent<MimeType extends string> = {
  content: { [key in MimeType]?: any }
}

type MimeContentValue<
  MimeType extends ApiMimeTypes,
  T extends MimeContent<MimeType>,
> = {
  [K in keyof T['content']]: T['content'][K]
}[keyof T['content']]

type OpenApiContentTypes<OpenApiContent extends Record<number, any>> = {
  [K in keyof OpenApiContent]: OpenApiContent[K] extends Content
    ? MimeContentValue<ApiMimeTypes, OpenApiContent[K]>
    : void
}[keyof OpenApiContent]

export type OperationParams<OperationId extends OperationIds> =
  operations[OperationId]['parameters']['path']

export type OperationQuery<OperationId extends OperationIds> =
  operations[OperationId]['parameters']['query']

export type OperationResponse<OperationId extends OperationIds> =
  OpenApiContentTypes<operations[OperationId]['responses']>

export type OperationBody<OperationId extends OperationIds> =
  operations[OperationId] extends never
    ? never
    : MimeContentValue<ApiMimeTypes, operations[OperationId]['requestBody']>

export type OpenApiHandler<OperationId extends OperationIds> =
  express.RequestHandler<
    OperationParams<OperationId>,
    OperationResponse<OperationId>,
    OperationBody<OperationId>,
    OperationQuery<OperationId>
  >

export type OperationHandler<OperationId extends keyof operations> = (
  ctx: RequestContext,
  req: Parameters<OpenApiHandler<OperationId>>[0],
  res: Parameters<OpenApiHandler<OperationId>>[1]
) => Promise<OperationResponse<OperationId>>

type RouteHandlers<SubsetOperationIds extends OperationIds> = {
  [Key in SubsetOperationIds]: OperationHandler<Key>
}

export type RestApiController<
  SubsetOperationIds extends OperationIds = OperationIds,
> = {
  [Key in SubsetOperationIds]: OpenApiHandler<Key>
}

const handleOperationAsync = <OperationId extends OperationIds>(
  fn: OperationHandler<OperationId>,
  operationId: OperationId
): OpenApiHandler<OperationId> => asyncHandler(fn as any, operationId) as any

const createRestController = <SubsetOperationIds extends OperationIds>(
  def: RouteHandlers<SubsetOperationIds>
): RestApiController<SubsetOperationIds> => {
  return Object.entries(def).reduce((ctrl, [operationId, handler]) => {
    if (!handler) {
      return ctrl
    }
    ctrl[operationId as SubsetOperationIds] = handleOperationAsync(
      handler as any,
      operationId as SubsetOperationIds
    ) as any
    return ctrl
  }, {} as RestApiController<SubsetOperationIds>)
}

export const openApiRouter = (
  router: express.Router,
  { removePrefix }: { removePrefix: string } = { removePrefix: '' }
) => ({
  express: router,
  route: <
    Method extends keyof paths[Path],
    Path extends keyof paths,
    OperationId extends OperationIds,
  >(
    method: Method,
    path: Path,
    handler: OpenApiHandler<OperationId>
  ) => {
    const route = path
      .toString()
      .replaceAll('}', '')
      .replaceAll('{', ':')
      // eslint-disable-next-line security/detect-non-literal-regexp
      .replace(new RegExp(`^${removePrefix}`), '')

    switch (method) {
      case 'get':
        router.get(route, handler)
        break
      case 'post':
        router.post(route, handler)
        break
      case 'PUT':
        router.put(route, handler)
        break
      case 'patch':
        router.patch(route, handler)
        break
      case 'delete':
        router.delete(route, handler)
        break
      case 'head':
        router.head(route, handler)
        break
      case 'trace':
        router.trace(route, handler)
        break
      case 'options':
        router.options(route, handler)
        break
      default:
        throw new Error(
          `The OpenApi router received invalid HTTP method to be registered: ${method.toString()}`
        )
    }
  },
})

export const registerOpenApiRoutes = <SomeOperationIds extends OperationIds>(
  router: ReturnType<typeof openApiRouter>,
  controller: Partial<RestApiController<SomeOperationIds>>
) => {
  const operations = Object.keys(controller) as SomeOperationIds[]
  operations.forEach(operation => {
    if (!controller[operation]) {
      return
    }

    router.route(
      operationPaths[operation].method,
      operationPaths[operation].path,
      controller[operation]
    )
  })
}

/**
 * ctrl is a scoped object for controller functions
 */
export const ctrl = {
  json: pipeMiddleware(
    bodyParser.json(),
    // Monkeypatch res.json to assign the body to res.out first in order
    // to log it by pino
    (_req, res: any, next) => {
      const resJson = res.json.bind(res)
      res.json = (body?: any) => {
        res.out = body
        return resJson(body)
      }
      next()
    }
  ),
  asyncHandler,
  createRestController,
  openApiRouter,
  registerOpenApiRoutes,
}
