import * as path from 'path'
import * as fs from 'fs'
import { logger } from './Logger.js'
export class Toolbelt {
  constructor(params) {
    this.npm = params.npm
    this.packageJson = params.packageJson
    this.assetDirectory = params.assetDirectory
    this.sharedDirectory = params.sharedDirectory
    this.destination = params.destination
    this.projectName = params.projectName
  }
  stringToPath(str) {
    return path.normalize(str)
  }
  mkdir(dirpath, option) {
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
  cpFile(a, b, option) {
    a = this.stringToPath(a)
    b = this.stringToPath(b)
    const file = path.basename(a)
    this.cp(a, this.stringToPath(`${b}/${option?.destFileName ?? file}`))
  }
  cp(a, b) {
    a = this.stringToPath(a)
    b = this.stringToPath(b)
    logger.info(`> cp ${a} ${b}`)
    fs.copyFileSync(a, b)
  }
  copyAsset(name, destination) {
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
  copySharedAsset(name, destination) {
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
  replaceInFile(filePath, placeholder, replacement = 'REPLACEME') {
    filePath = this.stringToPath(`${this.destination}/${filePath}`)
    let content = fs.readFileSync(filePath, 'utf8')
    /* eslint-disable-next-line security/detect-non-literal-regexp */
    content = content.replace(new RegExp(placeholder, 'g'), replacement)
    fs.writeFileSync(filePath, content)
  }
  symlink(linkName, linkedFile) {
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
//# sourceMappingURL=Toolbelt.js.map
