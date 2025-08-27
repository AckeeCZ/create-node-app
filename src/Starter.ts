import { Builder } from './Builder.js'

export interface Starter {
  readonly name: string
  setToolbelt(toolbelt: Builder): Starter
  install(): void
}
