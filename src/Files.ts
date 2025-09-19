import * as fsp from 'fs/promises'
import path from 'path'

export class Files {
  public static readonly PROJECT_DIR = path.normalize(
    path.join(import.meta.dirname, '..')
  )

  public static async exists(path: string) {
    const stat = await fsp.stat(path).catch(() => undefined)
    return Boolean(stat)
  }

  public static async existsAndIsDir(path: string) {
    const stat = await fsp.stat(path).catch(() => undefined)
    return Boolean(stat?.isDirectory())
  }
  public static async readUtf8File(path: string) {
    return fsp.readFile(path, 'utf8')
  }
}
