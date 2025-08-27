import { QueryResolvers } from '../../../generated/graphql.js'

export const greetingQueryResolver: QueryResolvers = {
  greeting: () => 'Hello, world! 🎉',
}
