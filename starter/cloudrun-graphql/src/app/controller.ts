import express from 'express'
import { Handler, RequestHandler } from 'express'

/**
 * pipeMiddleware takes multiple middlewares and creates and merges them into
 * one using express Router.
 */
export const pipeMiddleware = (...middlewares: RequestHandler[]) => {
  const router = express.Router({ mergeParams: true })
  middlewares.forEach(m => router.use(m))
  return router
}

const asyncHandler =
  (controllerHandler: Handler): Handler =>
  async (req, res, next) => {
    try {
      await controllerHandler(req, res, next)
    } catch (err) {
      next(err)
    }
  }

/**
 * ctrl is a scoped object for controller functions
 */
export const ctrl = {
  json: pipeMiddleware(
    express.json(),
    // Monkeypatch res.json to assign the body to res.out first in order
    // to log it by pino
    (_req, res, next) => {
      const resJson = res.json.bind(res)
      res.json = (body?: any) => {
        ;(res as any).out = body
        return resJson(body)
      }
      next()
    }
  ),
  asyncHandler,
}
