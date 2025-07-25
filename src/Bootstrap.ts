import { CloudFunctionsStarter } from './cloudfunctions/CloudFunctionsStarter'
import { CloudRunStarter } from './cloudrun/CloudRunStarter'
import { Npm } from './Npm'
import { Toolbelt } from './Toolbelt'
import * as path from 'path'
import { PackageJson } from './PackageJson'
import { GraphQLStarter } from './cloudrun-graphql/GraphQLStarter'
import { Path } from './types'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { logger } from './Logger'
import { Starter } from './Starter'

export default class Boostrap {
  protected starters: Starter[] = [
    new CloudRunStarter(),
    new CloudFunctionsStarter(),
    new GraphQLStarter(),
  ]

  public runCLI(args: string[]) {
    const cli = yargs(hideBin(args))
      .usage('create-node-app <starter> [options]')
      .positional('starter', {
        name: 'starter',
        type: 'string',
        required: true,
        description: 'Which template to setup (required)',
        choices: this.starters.map(starter => starter.name),
      })
      .option('dir', {
        type: 'string',
        alias: 'd',
        default: './node-app',
        description: 'Destination directory',
      })
      .option('project-name', {
        type: 'string',
        alias: 'n',
        default: 'node-app',
        description: 'Google Cloud project name',
      })
      .version('1.0.0')
      .help()

    const parsedArgs = cli.parseSync()
    const starterArg = parsedArgs._[0]

    const starter = this.starters.find(x => x.name === starterArg)
    const destination = path.normalize(parsedArgs.dir) as Path

    if (!starter) {
      logger.info('Invalid starter')
      cli.showHelp()
      process.exit(1)
    }

    logger.info(`starter=${starter.name}, destination=${destination}`)

    const npm = new Npm({ dir: destination })
    const packageJson = new PackageJson(npm)
    const toolbelt = new Toolbelt({
      npm,
      packageJson,
      assetDirectory: `${__filename}/../../starter/${starter.name}`,
      sharedDirectory: `${__filename}/../../starter/shared`,
      destination: destination,
      projectName: parsedArgs.projectName,
    })
    starter.setToolbelt(toolbelt)
    toolbelt.mkdir(destination, { overwrite: true })
    toolbelt.npm.init()
    starter.install()
  }
}
