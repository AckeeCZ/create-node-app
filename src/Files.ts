import * as fsp from 'fs/promises'
import path from 'path'

export class Files {
  public static async exists(filepath: string) {
    const stat = await fsp.stat(filepath).catch(() => undefined)
    return Boolean(stat)
  }

  public static async existsAndIsDir(filepath: string) {
    const stat = await fsp.stat(filepath).catch(() => undefined)
    return Boolean(stat?.isDirectory())
  }
  public static async readUtf8File(filepath: string) {
    return fsp.readFile(filepath, 'utf8')
  }
  public static isInSameTree(tree: string, filepath: string) {
    const file = path.normalize(filepath)
    const fileTree = path.normalize(tree)
    return file.startsWith(fileTree)
  }
}
