import { Merger } from './Merger.js'
import fsp from 'fs/promises'

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
      fsp.readFile(destPath, 'utf8'),
      fsp.readFile(originPath, 'utf8'),
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
