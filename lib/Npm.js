import * as childProcess from 'child_process'
import { logger } from './Logger.js'
export class Npm {
  constructor(settings) {
    this.dir = settings?.dir
  }
  run(args) {
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
  init() {
    this.run(['init', '--yes'])
  }
  i(module) {
    if (!module) {
      return this.run(['i'])
    }
    const args = ['i', module]
    this.run(args)
  }
  iDev(module) {
    const args = ['i', '-D', module]
    this.run(args)
  }
}
//# sourceMappingURL=Npm.js.map
