import { NextFunction, Request, Response } from 'express'
import { RequestContextFactory } from '../../../context.js'
import { Container } from '../../../container.js'

const createContextFromHttpRequestFactory =
  (): RequestContextFactory<[Request, Response]> =>
  async (container, _req, _res) => {
    return {
      type: 'api-user',
      container,
      user: null, // Implement Authentication if needed (Auth header, cookie, ...)
    }
  }

export const createContextMiddleware =
  (container: Container) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.context = await createContextFromHttpRequestFactory()(
        container,
        req,
        res
      )
      next()
    } catch (err) {
      next(err)
    }
  }
