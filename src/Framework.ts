import * as path from 'path'
import * as fs from 'fs'
import Starter from './Starter'
import * as childProcess from 'child_process'
import * as lodash from 'lodash'

export default class Framework {
  protected starters: Starter[]
  constructor(param: { starters: Starter[] }) {
    this.starters = param.starters
  }
  public runCLI(args: string[]) {
    const parsed = this.parseCLIArgs(args)
    this.printLn(
      `starter=${parsed.starter.name}, destination=${parsed.destination}`
    )
    this.mkdir(parsed.destination, { overwrite: true })
    const npm = this.createNpmReference({ dir: parsed.destination })
    this.npmInit(npm)
    const packageJson = this.createPackageJsonReference(npm)
    parsed.starter.install({
      destination: parsed.destination,
      framework: this,
      npm,
      packageJson,
      asset(input) {
        return path.normalize(
          `${__filename}/../../starter/${parsed.starter.name}/${input}`
        ) as Path
      },
    })
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

      const destination = args[3]
      return {
        starter,
        destination: path.normalize(destination ?? './node-app') as Path,
      }
    } catch (error: any) {
      this.printLn(`Failed to parse args. ${error?.stack}`)
      this.printCLIHelp()
      process.exit(1)
    }
  }

  protected printCLIHelp() {
    this.printLn(`
Usage: npx github:AckeeCZ/create-node-app STARTER [DIRECTORY]

STARTER        Which template to setup
DIRECTORY      Destination directory where to set the starter up (default: ./node-app)

Starters available:
    cloudrun        Cloud Run + express
`)
  }

  mkdir(
    dirpath: Path,
    option?: {
      /** If exists, remove recursively first */
      overwrite?: boolean
    }
  ) {
    if (fs.existsSync(dirpath) && option?.overwrite) {
      fs.rmSync(dirpath, { recursive: true })
    }
    fs.mkdirSync(dirpath)
  }

  protected createNpmReference(settings?: { dir?: Path }): Npm {
    return {
      dir: settings?.dir,
      run: args => {
        this.printLn(`> npm ${args.join(' ')}`)
        const result = settings?.dir
          ? childProcess.spawnSync('npm', args, {
              cwd: settings.dir,
            })
          : childProcess.spawnSync('npm', args)
        if ((result?.status ?? 0) > 0) {
          this.printLn(
            `Failed npm command: npm ${args.join(' ')}. ${String(
              result.output
            )}`
          )
        }
      },
    }
  }

  protected npmInit(npm: Npm) {
    npm.run(['init', '--yes'])
  }

  public npmi(npm: Npm, module?: string) {
    if (!module) {
      return npm.run(['i'])
    }
    const args = ['i', module]
    npm.run(args)
  }
  public npmiDev(npm: Npm, module: string) {
    const args = ['i', '-D', module]
    npm.run(args)
  }

  /**
   * Like cp, but second argument does not need to include file name
   * the name is preserved.
   */
  public cpFile(a: Path, b: Path) {
    const file = path.basename(a)
    this.cp(a, path.normalize(`${b}/${file}`) as Path)
  }

  public cp(a: Path, b: Path) {
    this.printLn(`> cp ${a} ${b}`)
    fs.copyFileSync(a, b)
  }

  protected createPackageJsonReference(npm: Npm): PackageJson {
    let packagejsonPath = './package.json' as Path
    if (npm.dir) {
      packagejsonPath = path.normalize(`${npm.dir}/${packagejsonPath}`) as Path
    }
    const json = () => JSON.parse(fs.readFileSync(packagejsonPath, 'utf-8'))
    return {
      path: packagejsonPath,
      json: () => json(),
      runScript: (name: string) => {
        npm.run(['run', name])
      },
    }
  }

  public addNpmScript(packageJson: PackageJson, name: string, command: string) {
    this.updatePackageJson(packageJson, {
      scripts: {
        [name]: command,
      },
    })
  }

  // Updated package json using merge with given object
  updatePackageJson(packageJson: PackageJson, obj: any) {
    const json = lodash.merge(packageJson.json(), obj)
    this.printLn(`> package.json updated ${JSON.stringify(obj)}`)
    fs.writeFileSync(
      path.join(packageJson.path),
      JSON.stringify(json, null, 2),
      'utf-8'
    )
  }
}
