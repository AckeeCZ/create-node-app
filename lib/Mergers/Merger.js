import fsp from 'fs/promises';
import path from 'path';
import { Files } from '../Files.js';
export class Merger {
    constructor(destDir, pathToFile) {
        this.destDir = destDir;
        this.pathToFile = pathToFile;
        this.destPath = path.join(this.destDir, this.pathToFile);
    }
    getDestPath() {
        return this.destPath;
    }
    getPaths(originDir) {
        return {
            originPath: path.join(originDir, this.pathToFile),
            destPath: this.getDestPath(),
        };
    }
    async getWhichExistsOrNull(originDir) {
        const { originPath, destPath } = this.getPaths(originDir);
        const [originExists, destExists] = await Promise.all([
            Files.exists(originPath),
            Files.exists(destPath),
        ]);
        if (!originExists && destExists) {
            return fsp.readFile(destPath, 'utf8');
        }
        if (!destExists && originExists) {
            return fsp.readFile(originPath, 'utf8');
        }
        if (!originExists && !destExists) {
            throw new Error(`No file found to merge: ${this.pathToFile}`);
        }
        return null;
    }
}
//# sourceMappingURL=Merger.js.map