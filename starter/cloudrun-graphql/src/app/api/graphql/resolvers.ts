import { Resolvers } from '../../../generated/graphql.js'
import { greetingQueryResolver } from './resolvers/greeting.resolver.js'

export const resolvers: Resolvers = {
  Query: greetingQueryResolver,
}
