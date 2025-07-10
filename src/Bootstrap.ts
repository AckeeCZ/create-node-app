import CloudFunctionsStarter from './cloudfunctions/CloudFunctionsStarter'
import CloudRunStarter from './cloudrun/CloudRunStarter'
import Npm from './Npm'
import Starter from './Starter'
import Toolbelt from './Toolbelt'
import * as path from 'path'
import PackageJson from './PackageJson'
import GraphQLStarter from './cloudrun-graphql/GraphQLStarter'
import { Path } from './types'

export default class Boostrap {
  protected starters: Starter[]
  constructor() {
    this.starters = [
      new CloudRunStarter(),
      new CloudFunctionsStarter(),
      new GraphQLStarter(),
    ]
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
      sharedDirectory: `${__filename}/../../starter/shared`,
      destination: parsed.destination,
      projectName: parsed.projectName,
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

      const { destination, projectName } = this.parseOptionalArgs(args.slice(3))

      return {
        starter,
        destination: path.normalize(destination) as Path,
        projectName,
      }
    } catch (error: any) {
      this.printLn(`Failed to parse args. ${error?.stack}`)
      this.printCLIHelp()
      process.exit(1)
    }
  }

  private parseOptionalArgs(remainingArgs: string[]) {
    let destination: string | undefined
    let projectName: string | undefined

    for (let i = 0; i < remainingArgs.length; i++) {
      const arg = remainingArgs[i]
      const nextArg = remainingArgs[i + 1]

      if ((arg === '--dir' || arg === '-d') && nextArg) {
        destination = nextArg
        i++ // Skip next arg as it's the value
      } else if ((arg === '--name' || arg === '-n') && nextArg) {
        projectName = nextArg
        i++ 
      } else if (arg === '--help' || arg === '-h') {
        this.printCLIHelp()
        process.exit(0)
      } else {
        this.printLn(`Unknown argument: ${arg}`)
        this.printCLIHelp()
        process.exit(1)
      }
    }

    // Apply defaults
    const finalDestination = destination ?? './node-app'
    const finalProjectName = projectName ?? path.basename(path.resolve(finalDestination))

    return {
      destination: finalDestination,
      projectName: finalProjectName,
    }
  }

  protected printCLIHelp() {
    this.printLn(`
    Usage: npx github:AckeeCZ/create-node-app STARTER [OPTIONS]

    STARTER        Which template to setup (required)

    Options:
      --dir, -d DIR       Destination directory (default: ./node-app)
      --name, -n NAME     Project name used in config files (default: directory basename)
      --help, -h          Show this help message

    Examples:
      create-node-app cloudrun
      create-node-app cloudrun --dir ./my-app
      create-node-app cloudrun --name my-project  
      create-node-app cloudrun --dir ./my-app --name my-project

    Starters available:
        cloudrun          Cloud Run + express
        cloudrun-graphql  Cloud Run + express + graphql
        cloudfunctions    Cloud Functions + graphql
    `)
  }
}
