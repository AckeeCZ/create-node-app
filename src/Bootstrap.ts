import inquirer from 'inquirer'
import * as path from 'path'
import * as fs from 'fs'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { Builder } from './Builder.js'
import { Logger } from './Logger.js'
import { Npm } from './Npm.js'
import { PackageJson } from './PackageJson.js'
import { LoadedStarter, StarterLoader } from './StarterLoader.js'
import { Path } from './types.js'

interface ParsedArgs {
  dir: string
  debug: boolean
  force: boolean
  projectName: string
  [key: string]: unknown
}

export class Bootstrap {
  protected starterLoader = new StarterLoader()

  private async askMissingOptions(parsedArgs: ParsedArgs) {
    const starters: LoadedStarter[] = []

    for (const module of this.starterLoader.getOptions()) {
      const moduleOption = parsedArgs[module.name.toLowerCase()] as string
      if (moduleOption) {
        if (moduleOption !== 'none') {
          starters.push(this.starterLoader.getStarter(moduleOption))
        }
        continue
      }

      const answer = await inquirer.prompt<{ starter: string }>({
        type: 'list',
        name: 'starter',
        message: `Which ${module.name} would you like to use?`,
        choices: [...module.starters, 'none'],
      })

      if (answer.starter !== 'none') {
        starters.push(this.starterLoader.getStarter(answer.starter))
      }
    }
    return starters
  }

  public async runCLI(args: string[]) {
    try {
      let cli = yargs(hideBin(args))
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

      const starterOptions = this.starterLoader.getOptions()
      for (const module of starterOptions) {
        cli = cli.option(module.name.toLowerCase(), {
          type: 'string',
          choices: ['none', ...module.starters],
          description: `Selects ${module.name}`,
        })
      }

      cli = cli
        .version('1.0.0')
        .help()
        .check(argv => {
          for (const [key, val] of Object.entries(argv)) {
            if (Array.isArray(val) && key !== '_') {
              throw new Error(`Option --${key} specified multiple times`)
            }
          }
          return true
        })

      const parsedArgs = cli.parseSync()

      const destination = path.normalize(parsedArgs.dir) as Path

      const logger = new Logger(parsedArgs.debug)
      const npm = new Npm({ dir: destination, logger })
      const packageJson = new PackageJson(npm, logger)

      if (fs.existsSync(destination) && !parsedArgs.force) {
        const answer = await inquirer.prompt<{ force: boolean }>({
          type: 'confirm',
          name: 'force',
          message: `Destination directory "${destination}" already exists. Do you want to overwrite everything in it?`,
        })
        if (!answer.force) {
          process.exit(0)
        }
      }

      const starters = await this.askMissingOptions(parsedArgs)

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
