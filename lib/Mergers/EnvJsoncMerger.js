import { Merger } from './Merger.js';
import fsp from 'fs/promises';
export class EnvJsoncMerger extends Merger {
    async merge(originDir) {
        const content = await this.getWhichExistsOrNull(originDir);
        if (content) {
            return content;
        }
        const { originPath, destPath } = this.getPaths(originDir);
        const [destEnvConfig, originEnvConfig] = await Promise.all([
            fsp.readFile(destPath, 'utf8'),
            fsp.readFile(originPath, 'utf8'),
        ]);
        const originWithoutOpenBracket = originEnvConfig.replace('{\n', '');
        return destEnvConfig
            .replace(',\n}\n', '\n}\n')
            .replace('\n}\n', `,\n${originWithoutOpenBracket}`);
    }
}
//# sourceMappingURL=EnvJsoncMerger.js.map