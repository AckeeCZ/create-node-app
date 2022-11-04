import * as path from 'path'
import * as fs from 'fs'
import Starter from './Starter'

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
    parsed.starter.install({
      destination: parsed.destination,
      framework: this,
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
        destination: path.normalize(destination ?? './node-app'),
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
    dirpath: string[],
    option?: {
      /** If exists, remove recursively first */
      overwrite?: boolean
    }
  ) {
    const p = path.join(...dirpath)
    if (fs.existsSync(path.join(p)) && option?.overwrite) {
      fs.rmSync(p, { recursive: true })
    }
    fs.mkdirSync(p)
  }
}
