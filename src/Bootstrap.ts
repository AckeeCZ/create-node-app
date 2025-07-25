import { CloudFunctionsStarter } from './cloudfunctions/CloudFunctionsStarter.js'
import { CloudRunStarter } from './cloudrun/CloudRunStarter.js'
import { Npm } from './Npm.js'
import { Toolbelt } from './Toolbelt.js'
import * as path from 'path'
import { PackageJson } from './PackageJson.js'
import { GraphQLStarter } from './cloudrun-graphql/GraphQLStarter.js'
import { Path } from './types.js'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { logger } from './Logger.js'
import { Starter } from './Starter.js'

export class Bootstrap {
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
      assetDirectory: path.join(
        import.meta.dirname,
        '..',
        'starter',
        starter.name
      ),
      sharedDirectory: path.join(
        import.meta.dirname,
        '..',
        'starter',
        'shared'
      ),
      destination: destination,
      projectName: parsedArgs.projectName,
    })
    starter.setToolbelt(toolbelt)
    toolbelt.mkdir(destination, { overwrite: true })
    toolbelt.npm.init()
    starter.install()
  }
}
