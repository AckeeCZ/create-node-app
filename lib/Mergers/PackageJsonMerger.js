import { Merger } from './Merger.js'
import { Files } from '../Files.js'
export class PackageJsonMerger extends Merger {
  constructor(projectName, destDir, pathToFile) {
    super(destDir, pathToFile)
    this.projectName = projectName
  }
  async merge(originDir) {
    const content = await this.getWhichExistsOrNull(originDir)
    if (content) {
      return content
    }
    const { originPath, destPath } = this.getPaths(originDir)
    const [destPckgJson, starterPckgJson] = await Promise.all([
      Files.readUtf8File(destPath),
      Files.readUtf8File(originPath),
    ])
    const destPckgJsonObj = JSON.parse(destPckgJson)
    const starterPckgJsonObj = JSON.parse(starterPckgJson)
    destPckgJsonObj.name = this.projectName
    destPckgJsonObj.scripts = {
      ...destPckgJsonObj.scripts,
      ...starterPckgJsonObj.scripts,
    }
    destPckgJsonObj.dependencies = {
      ...destPckgJsonObj.dependencies,
      ...starterPckgJsonObj.dependencies,
    }
    destPckgJsonObj.devDependencies = {
      ...destPckgJsonObj.devDependencies,
      ...starterPckgJsonObj.devDependencies,
    }
    return JSON.stringify(destPckgJsonObj, null, 2)
  }
}
//# sourceMappingURL=PackageJsonMerger.js.map
