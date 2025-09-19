import { Files } from '../Files.js'
import { Merger } from './Merger.js'
export class ConfigMerger extends Merger {
  constructor() {
    super(...arguments)
    this.name = 'Config'
  }
  async merge(originDir) {
    const content = await this.getWhichExistsOrNull(originDir)
    if (content) {
      return content
    }
    const { originPath, destPath } = this.getPaths(originDir)
    const [destTsConfig, originTsConfig] = await Promise.all([
      Files.readUtf8File(destPath),
      Files.readUtf8File(originPath),
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
//# sourceMappingURL=ConfigMerger.js.map
