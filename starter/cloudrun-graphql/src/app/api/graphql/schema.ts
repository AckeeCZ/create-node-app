import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeTypeDefs } from '@graphql-tools/merge'
import path from 'path'

export const schema = [
  mergeTypeDefs(loadFilesSync(path.join(__dirname, 'schema'))),
]
