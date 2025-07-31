import yargs, { Argv } from 'yargs'
import { hideBin } from 'yargs/helpers'
import { readdir, stat } from 'fs/promises'
import { join, extname } from 'path'

interface CommandDefinition {
  description: string
  positional?: string
  run: (argv: any) => Promise<void> | void
  options?: (yargs: Argv) => Argv
  [key: string]: any
}

const loadCommand = async (
  commandName: string,
  commandPath: string,
  yargsInstance: Argv
) => {
  try {
    const modulePath = `file://${commandPath}`
    const commandModule = (await import(modulePath)) as CommandDefinition

    if (typeof commandModule.run === 'function') {
      yargsInstance.command(
        commandModule.positional
          ? `${commandName} ${commandModule.positional}`
          : commandName,
        commandModule.description ?? `${commandName} command`,
        (yargs: Argv) => {
          if (typeof commandModule.options === 'function') {
            return commandModule.options(yargs)
          }
        },
        async (argv: any) => {
          try {
            await commandModule.run(argv)
          } catch (error) {
            console.error(`Error running ${commandName}:`, error)
            process.exit(1)
          }
        }
      )
    } else {
      console.warn(`Warning: ${commandPath} does not export a 'run' function`)
    }
  } catch (error) {
    console.error(`Error loading command from ${commandPath}:`, error)
  }
}

const loadCommandsFromDirectory = async (
  dirPath: string,
  yargsInstance: Argv
): Promise<void> => {
  const items = await readdir(dirPath)

  for (const item of items) {
    const fullPath = join(dirPath, item)
    const stats = await stat(fullPath)

    if (stats.isDirectory()) {
      yargsInstance.command(item, `${item} module`, (yargs: Argv) => {
        yargs.demandCommand(1, 'You need to specify a command.')
        yargs.help()
        return loadCommandsFromDirectory(fullPath, yargs)
      })
    } else if (stats.isFile() && extname(item) === '.ts' && item !== 'cli.ts') {
      const commandName = item.replace('.ts', '')
      await loadCommand(commandName, fullPath, yargsInstance)
    }
  }
}

export const cli = async () => {
  const yargsInstance = yargs(hideBin(process.argv))
    .scriptName('cli')
    .usage('Usage: $0 <command> [options]')
    .demandCommand(1, 'You need to specify a command or module.')
    .help()
    .version()

  await loadCommandsFromDirectory(import.meta.dirname, yargsInstance)

  await yargsInstance.parse()

  process.exit(0)
}

void cli()
