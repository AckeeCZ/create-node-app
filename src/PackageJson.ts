import * as path from 'path'
import * as fs from 'fs'
import * as lodash from 'lodash'
import { Npm } from './Npm'
import { logger } from './Logger'
import { Path } from './types'

export class PackageJson {
  public readonly path: Path
  protected npm: Npm
  constructor(npm: Npm) {
    let packagejsonPath = './package.json' as Path
    if (npm.dir) {
      packagejsonPath = path.normalize(`${npm.dir}/${packagejsonPath}`) as Path
    }
    this.path = packagejsonPath
    this.npm = npm
  }
  public toJSON() {
    return JSON.parse(fs.readFileSync(this.path, 'utf-8'))
  }
  public runScript(name: string) {
    this.npm.run(['run', name])
  }
  public addNpmScript(name: string, command: string) {
    this.mergeWith({
      scripts: {
        [name]: command,
      },
    })
  }
  // Updated package json using merge with given object
  public mergeWith(partialWith: any) {
    const json = lodash.merge(this.toJSON(), partialWith)
    logger.info(`> package.json updated ${JSON.stringify(partialWith)}`)
    fs.writeFileSync(
      path.join(this.path),
      JSON.stringify(json, null, 2),
      'utf-8'
    )
  }
}
