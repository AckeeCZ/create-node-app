import path from 'path'
import { Files } from '../Files.js'

export abstract class Merger {
  abstract merge(originDir: string): Promise<string>

  protected destPath: string

  constructor(
    protected readonly destDir: string,
    protected readonly pathToFile: string
  ) {
    this.destPath = path.join(this.destDir, this.pathToFile)
  }

  public getDestPath() {
    return this.destPath
  }

  protected getPaths(originDir: string) {
    return {
      originPath: path.join(originDir, this.pathToFile),
      destPath: this.getDestPath(),
    }
  }

  protected async getWhichExistsOrNull(
    originDir: string
  ): Promise<string | null> {
    const { originPath, destPath } = this.getPaths(originDir)

    const [originExists, destExists] = await Promise.all([
      Files.exists(originPath),
      Files.exists(destPath),
    ])

    if (!originExists && destExists) {
      return Files.readUtf8File(destPath)
    }

    if (!destExists && originExists) {
      return Files.readUtf8File(originPath)
    }

    if (!originExists && !destExists) {
      throw new Error(`No file found to merge: ${this.pathToFile}`)
    }

    return null
  }
}
