import * as fsp from 'fs/promises'
import path from 'path'
export class Files {
  static async exists(filepath) {
    const stat = await fsp.stat(filepath).catch(() => undefined)
    return Boolean(stat)
  }
  static async existsAndIsDir(filepath) {
    const stat = await fsp.stat(filepath).catch(() => undefined)
    return Boolean(stat?.isDirectory())
  }
  static async readUtf8File(filepath) {
    return fsp.readFile(filepath, 'utf8')
  }
  static isInSameTree(tree, filepath) {
    const file = path.normalize(filepath)
    const fileTree = path.normalize(tree)
    return file.startsWith(fileTree)
  }
}
//# sourceMappingURL=Files.js.map
