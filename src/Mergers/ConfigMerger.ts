import { Merger } from './Merger.js'
import fsp from 'fs/promises'

export class ConfigMerger extends Merger {
  name = 'Config'

  async merge(originDir: string): Promise<string> {
    const content = await this.getWhichExistsOrNull(originDir)
    if (content) {
      return content
    }

    const { originPath, destPath } = this.getPaths(originDir)

    const [destTsConfig, originTsConfig] = await Promise.all([
      fsp.readFile(destPath, 'utf8'),
      fsp.readFile(originPath, 'utf8'),
    ])
    const configContent = /configSchema = {\n(.*?)\n}\n/s.exec(
      originTsConfig
    )?.[1]

    return destTsConfig.replace(
      '\n}\n',
      configContent ? `${configContent}\n}\n` : '}\n'
    )
  }
}
