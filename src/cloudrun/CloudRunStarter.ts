import Starter from '../Starter'

export default class CloudRunStarter implements Starter {
  public readonly name = 'cloudrun'
  install(param: { destination: string }): void {}
}
