import * as childProcess from 'child_process'
import { Logger } from './Logger.js'
export class NpmError extends Error {
  constructor(message, code) {
    super(message)
    this.code = code
    this.name = 'NpmError'
  }
}
export class Npm {
  constructor(settings) {
    this.logger = settings?.logger ?? new Logger()
    this.dir = settings?.dir
  }
  spawn(cmd, args, options = {}) {
    return new Promise((resolve, reject) => {
      const cp = childProcess.spawn(cmd, args, options)
      const error = []
      const stdout = []
      cp.stdout?.on('data', data => {
        stdout.push(data.toString())
      })
      cp.on('error', e => {
        error.push(e.toString())
      })
      cp.on('close', code => {
        if (error.length || (code !== null && code > 0)) {
          reject(
            new NpmError(
              error.length ? error.join('') : stdout.join(''),
              code ?? null
            )
          )
        } else {
          resolve(undefined)
        }
      })
    })
  }
  run(args) {
    this.logger.debug(`> npm ${args.join(' ')}`)
    const options = this.dir
      ? {
          cwd: this.dir,
          stdio: this.logger.enableDebug ? 'inherit' : 'pipe',
        }
      : { stdio: this.logger.enableDebug ? 'inherit' : 'pipe' }
    return this.spawn('npm', args, options)
  }
  init() {
    return this.run(['init', '--yes'])
  }
  i(module) {
    if (!module) {
      return this.run(['i'])
    }
    const args = ['i', module]
    return this.run(args)
  }
  iDev(module) {
    const args = ['i', '-D', module]
    return this.run(args)
  }
}
//# sourceMappingURL=Npm.js.map
