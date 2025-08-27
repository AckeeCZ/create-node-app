import fsp from 'fs/promises'
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
      return fsp.readFile(destPath, 'utf8')
    }

    if (!destExists && originExists) {
      return fsp.readFile(originPath, 'utf8')
    }

    if (!originExists && !destExists) {
      throw new Error(`No file found to merge: ${this.pathToFile}`)
    }

    return null
  }
}
