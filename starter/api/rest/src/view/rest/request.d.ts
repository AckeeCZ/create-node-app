import { RequestContext } from '../../context.js'

declare global {
  namespace Express {
    export interface Request {
      context: RequestContext
    }
  }
}
