import * as fsp from 'fs/promises'

export class Files {
  public static async exists(path: string) {
    const stat = await fsp.stat(path).catch(() => undefined)
    return Boolean(stat)
  }

  public static async existsAndIsDir(path: string) {
    const stat = await fsp.stat(path).catch(() => undefined)
    return Boolean(stat?.isDirectory())
  }
}
