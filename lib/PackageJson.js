import * as path from 'path'
import * as fs from 'fs'
import * as lodash from 'lodash-es'
import { logger } from './Logger.js'
export class PackageJson {
  constructor(npm) {
    let packagejsonPath = './package.json'
    if (npm.dir) {
      packagejsonPath = path.normalize(`${npm.dir}/${packagejsonPath}`)
    }
    this.path = packagejsonPath
    this.npm = npm
  }
  setType(type) {
    this.mergeWith({
      type,
    })
  }
  toJSON() {
    return JSON.parse(fs.readFileSync(this.path, 'utf-8'))
  }
  runScript(name) {
    this.npm.run(['run', name])
  }
  addNpmScript(name, command) {
    this.mergeWith({
      scripts: {
        [name]: command,
      },
    })
  }
  // Updated package json using merge with given object
  mergeWith(partialWith) {
    const json = lodash.merge(this.toJSON(), partialWith)
    logger.info(`> package.json updated ${JSON.stringify(partialWith)}`)
    fs.writeFileSync(
      path.join(this.path),
      JSON.stringify(json, null, 2),
      'utf-8'
    )
  }
}
//# sourceMappingURL=PackageJson.js.map
