import { Toolbelt } from './Toolbelt'

export interface Starter {
  readonly name: string
  setToolbelt(toolbelt: Toolbelt): Starter
  install(): void
}
