import * as fsp from 'fs/promises'
export class Files {
  static async exists(path) {
    const stat = await fsp.stat(path).catch(() => undefined)
    return Boolean(stat)
  }
  static async existsAndIsDir(path) {
    const stat = await fsp.stat(path).catch(() => undefined)
    return Boolean(stat?.isDirectory())
  }
  static async readUtf8File(path) {
    return fsp.readFile(path, 'utf8')
  }
}
//# sourceMappingURL=Files.js.map
