import CloudFunctionsStarter from './cloudfunctions/CloudFunctionsStarter'
import CloudRunStarter from './cloudrun/CloudRunStarter'
import Npm from './Npm'
import Starter from './Starter'
import Toolbelt from './Toolbelt'
import * as path from 'path'
import PackageJson from './PackageJson'

export default class Boostrap {
  protected starters: Starter[]
  constructor() {
    this.starters = [new CloudRunStarter(), new CloudFunctionsStarter()]
  }
  public runCLI(args: string[]) {
    const parsed = this.parseCLIArgs(args)
    this.printLn(
      `starter=${parsed.starter.name}, destination=${parsed.destination}`
    )

    const npm = new Npm({ dir: parsed.destination })
    const packageJson = new PackageJson(npm)
    const toolbelt = new Toolbelt({
      npm,
      packageJson,
      assetDirectory: `${__filename}/../../starter/${parsed.starter.name}`,
      destination: parsed.destination,
    })
    parsed.starter.setToolbelt(toolbelt)
    toolbelt.mkdir(parsed.destination, { overwrite: true })
    toolbelt.npm.init()
    parsed.starter.install()
  }
  printLn(str: string) {
    console.log(str)
  }
  protected parseCLIArgs(args: string[]) {
    try {
      const starterArg = args[2]
      const starter = this.starters.find(x => x.name === starterArg)

      if (!starter) {
        this.printLn('Invalid starter')
        this.printCLIHelp()
        process.exit(1)
      }

      const destination = args[3]
      return {
        starter,
        destination: path.normalize(destination ?? './node-app') as Path,
      }
    } catch (error: any) {
      this.printLn(`Failed to parse args. ${error?.stack}`)
      this.printCLIHelp()
      process.exit(1)
    }
  }

  protected printCLIHelp() {
    this.printLn(`
    Usage: npx github:AckeeCZ/create-node-app STARTER [DIRECTORY]
    
    STARTER        Which template to setup
    DIRECTORY      Destination directory where to set the starter up (default: ./node-app)
    
    Starters available:
        cloudrun        Cloud Run + express
				cloudfunctions	Cloud Functions + graphql
    `)
  }
}
