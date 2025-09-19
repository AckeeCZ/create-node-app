import { Merger } from './Merger.js'
import { Files } from '../Files.js'
export class EnvJsoncMerger extends Merger {
  async merge(originDir) {
    const content = await this.getWhichExistsOrNull(originDir)
    if (content) {
      return content
    }
    const { originPath, destPath } = this.getPaths(originDir)
    const [destEnvConfig, originEnvConfig] = await Promise.all([
      Files.readUtf8File(destPath),
      Files.readUtf8File(originPath),
    ])
    const originWithoutOpenBracket = originEnvConfig.replace('{\n', '')
    return destEnvConfig
      .replace(',\n}\n', '\n}\n')
      .replace('\n}\n', `,\n${originWithoutOpenBracket}`)
  }
}
//# sourceMappingURL=EnvJsoncMerger.js.map
