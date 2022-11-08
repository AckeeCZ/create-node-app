import Starter from '../Starter'
import Toolbelt from '../Toolbelt'

export default class CloudRunStarter implements Starter {
  public readonly name = 'cloudrun'
  public setToolbelt(toolbelt: Toolbelt): Starter {
    return this // TODO
  }
  public install(): void {

  }
}
