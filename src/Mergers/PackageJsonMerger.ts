import { Merger } from './Merger.js'
import { Files } from '../Files.js'

export class PackageJsonMerger extends Merger {
  constructor(
    private readonly projectName: string,
    destDir: string,
    pathToFile: string
  ) {
    super(destDir, pathToFile)
  }

  async merge(originDir: string): Promise<string> {
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
