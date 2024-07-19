import * as childProcess from 'child_process'
import logger from './Logger'
import { Path } from './types'

export default class Npm {
  public readonly dir: Path
  constructor(settings?: { dir?: Path }) {
    this.dir = settings?.dir as Path
  }
  public run(args: string[]) {
    logger.info(`> npm ${args.join(' ')}`)
    const result = this.dir
      ? childProcess.spawnSync('npm', args, {
          cwd: this.dir,
        })
      : childProcess.spawnSync('npm', args)
    if ((result?.status ?? 0) > 0) {
      logger.info(
        `Failed npm command: npm ${args.join(' ')}. ${String(result.output)}`
      )
    }
  }
  public init() {
    this.run(['init', '--yes'])
  }

  public i(module?: string) {
    if (!module) {
      return this.run(['i'])
    }
    const args = ['i', module]
    this.run(args)
  }
  public iDev(module: string) {
    const args = ['i', '-D', module]
    this.run(args)
  }
}
