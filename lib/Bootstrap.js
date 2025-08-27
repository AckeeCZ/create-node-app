import inquirer from 'inquirer'
import * as path from 'path'
import * as fs from 'fs'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { Builder } from './Builder.js'
import { Logger } from './Logger.js'
import { Npm } from './Npm.js'
import { PackageJson } from './PackageJson.js'
import { StarterLoader } from './StarterLoader.js'
export class Bootstrap {
  constructor() {
    this.starterLoader = new StarterLoader()
  }
  async runCLI(args) {
    try {
      const cli = yargs(hideBin(args))
        .usage('create-node-app [options]')
        .option('dir', {
          type: 'string',
          alias: 'd',
          default: './node-app',
          description: 'Destination directory',
        })
        .option('debug', {
          type: 'boolean',
          alias: 'D',
          default: false,
          description: 'Enables debug logs',
        })
        .option('project-name', {
          type: 'string',
          alias: 'n',
          default: 'node-app',
          description: 'Google Cloud project name',
        })
        .option('force', {
          type: 'boolean',
          alias: 'f',
          default: false,
          description:
            "Overwrite existing destination directory if it's not empty",
        })
        .version('1.0.0')
        .help()
      const parsedArgs = cli.parseSync()
      const destination = path.normalize(parsedArgs.dir)
      const logger = new Logger(parsedArgs.debug)
      const npm = new Npm({ dir: destination, logger })
      const packageJson = new PackageJson(npm)
      const starters = []
      if (fs.existsSync(destination) && !parsedArgs.force) {
        if (!parsedArgs.force) {
          const answer = await inquirer.prompt({
            type: 'confirm',
            name: 'force',
            message: `Destination directory "${destination}" already exists. Do you want to overwrite everything in it?`,
          })
          if (!answer.force) {
            process.exit(0)
          }
        }
      }
      for (const module of this.starterLoader.getOptions()) {
        const answer = await inquirer.prompt({
          type: 'list',
          name: 'starter',
          message: `Which ${module.name} would you like to use?`,
          choices: [...module.starters, 'none'],
        })
        if (answer.starter === 'none') {
          continue
        }
        starters.push(this.starterLoader.getStarter(answer.starter))
      }
      const builder = new Builder({
        npm,
        logger,
        packageJson,
        starters,
        destination: destination,
        projectName: parsedArgs.projectName,
      })
      await builder.build()
    } catch (error) {
      if (error instanceof Error && error.name === 'ExitPromptError') {
        process.exit(0)
      } else {
        throw error
      }
    }
  }
}
//# sourceMappingURL=Bootstrap.js.map
