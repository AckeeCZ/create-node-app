import Toolbelt from './Toolbelt'

export default interface Starter {
  readonly name: string
  setToolbelt(toolbelt: Toolbelt): Starter
  install(): void
}
