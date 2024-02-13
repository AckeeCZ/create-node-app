import { QueryResolvers } from '../../../../generated/graphql'

export const greetingQueryResolver: QueryResolvers = {
  greeting: () => 'Hello, world! 🎉',
}
