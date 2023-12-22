import { Resolvers } from '../../../generated/graphql'
import { greetingQueryResolver } from './resolvers/greeting.resolver'

export const resolvers: Resolvers = {
  Query: greetingQueryResolver,
}
