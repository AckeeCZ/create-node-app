import * as childProcess from 'child_process'
import { Logger } from './Logger.js'
import { Path } from './types.js'

export class NpmError extends Error {
  constructor(
    message: string,
    public readonly code: number | null
  ) {
    super(message)
    this.name = 'NpmError'
  }
}

export class Npm {
  protected readonly logger: Logger
  public readonly dir: Path

  constructor(settings?: { dir?: Path; logger?: Logger }) {
    this.logger = settings?.logger ?? new Logger()
    this.dir = settings?.dir as Path
  }

  protected spawn(
    cmd: string,
    args: ReadonlyArray<string>,
    options: childProcess.SpawnOptions = {}
  ) {
    return new Promise((resolve, reject) => {
      const cp = childProcess.spawn(cmd, args, options)
      const error: string[] = []
      const stdout: string[] = []

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

  public run(args: string[]) {
    this.logger.debug(`> npm ${args.join(' ')}`)
    const options: childProcess.SpawnOptions = this.dir
      ? {
          cwd: this.dir,
          stdio: this.logger.enableDebug ? 'inherit' : 'pipe',
        }
      : { stdio: this.logger.enableDebug ? 'inherit' : 'pipe' }

    return this.spawn('npm', args, options)
  }
  public init() {
    return this.run(['init', '--yes'])
  }

  public i(module?: string) {
    if (!module) {
      return this.run(['i'])
    }
    const args = ['i', module]
    return this.run(args)
  }
  public iDev(module: string) {
    const args = ['i', '-D', module]
    return this.run(args)
  }
}
