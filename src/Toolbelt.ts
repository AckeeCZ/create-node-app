import * as path from 'path'
import * as fs from 'fs'
import PackageJson from './PackageJson'
import Npm from './Npm'
import logger from './Logger'
import { Path } from './types'

export default class Toolbelt {
  public readonly npm: Npm
  public readonly packageJson: PackageJson
  readonly assetDirectory: string
  readonly sharedDirectory: string
  readonly destination: string
  constructor(params: {
    npm: Npm
    packageJson: PackageJson
    assetDirectory: string
    sharedDirectory: string
    destination: string
  }) {
    this.npm = params.npm
    this.packageJson = params.packageJson
    this.assetDirectory = params.assetDirectory
    this.sharedDirectory = params.sharedDirectory
    this.destination = params.destination
  }
  public stringToPath(str: string) {
    return path.normalize(str) as Path
  }
  public mkdir(
    dirpath: string,
    option?: {
      /** If exists, remove recursively first */
      overwrite?: boolean
    }
  ) {
    dirpath = this.stringToPath(dirpath)
    const rootPath = ['.', './']
    if (!rootPath.includes(dirpath)) {
      if (fs.existsSync(dirpath) && option?.overwrite) {
        fs.rmSync(dirpath, { recursive: true })
      }
      fs.mkdirSync(dirpath)
    }
  }
  /**
   * Like cp, but second argument does not need to include file name
   * the name is preserved.
   */
  public cpFile(a: string, b: string, option?: { destFileName?: string }) {
    a = this.stringToPath(a)
    b = this.stringToPath(b)
    const file = path.basename(a)
    this.cp(a, this.stringToPath(`${b}/${option?.destFileName ?? file}`))
  }

  public cp(a: string, b: string) {
    a = this.stringToPath(a)
    b = this.stringToPath(b)
    logger.info(`> cp ${a} ${b}`)
    fs.copyFileSync(a, b)
  }
  public copyAsset(name: string, destination?: string) {
    let destinationName = name
    if (path.basename(name) === '.gitignore') {
      name = '.gitignore_'
      destinationName = '.gitignore'
    }
    name = this.stringToPath(name)
    destination = this.stringToPath(this.destination)
    this.cpFile(`${this.assetDirectory}/${name}`, destination, {
      destFileName: destinationName,
    })
  }
  public copySharedAsset(name: string, destination?: string) {
    let destinationName = name
    if (path.basename(name) === '.gitignore') {
      name = '.gitignore_'
      destinationName = '.gitignore'
    }
    name = this.stringToPath(name)
    destination = this.stringToPath(this.destination)
    this.cpFile(`${this.sharedDirectory}/${name}`, destination, {
      destFileName: destinationName,
    })
  }
  public symlink(linkName: string, linkedFile: string) {
    linkName = this.stringToPath(linkName)
    linkedFile = this.stringToPath(linkedFile)
    logger.info(`> ln -s ${linkName} ${linkedFile}`)
    try {
      fs.symlinkSync(linkedFile, linkName)
    } catch (error) {
      if ('code' in error && error.code === 'EEXIST') {
        // OK
      } else {
        throw error
      }
    }
  }
}
