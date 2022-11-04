import Framework from './Framework'

export default interface Starter {
  readonly name: string
  install(param: { destination: string; framework: Framework }): void
}
