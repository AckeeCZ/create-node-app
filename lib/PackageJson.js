import * as path from 'path'
import * as fs from 'fs'
import * as lodash from 'lodash-es'
export class PackageJson {
  constructor(npm, logger) {
    let packagejsonPath = './package.json'
    if (npm.dir) {
      packagejsonPath = path.normalize(`${npm.dir}/${packagejsonPath}`)
    }
    this.path = packagejsonPath
    this.npm = npm
    this.logger = logger
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
    return this.npm.run(['run', name])
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
    this.logger.debug(`> package.json updated ${JSON.stringify(partialWith)}`)
    fs.writeFileSync(
      path.join(this.path),
      JSON.stringify(json, null, 2),
      'utf-8'
    )
  }
}
//# sourceMappingURL=PackageJson.js.map
