import { Toolbelt } from './Toolbelt.js'

export interface Starter {
  readonly name: string
  setToolbelt(toolbelt: Toolbelt): Starter
  install(): void
}
