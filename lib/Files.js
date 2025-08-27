import * as fsp from 'fs/promises';
export class Files {
    static async exists(path) {
        const stat = await fsp.stat(path).catch(() => undefined);
        return Boolean(stat);
    }
    static async existsAndIsDir(path) {
        const stat = await fsp.stat(path).catch(() => undefined);
        return Boolean(stat?.isDirectory());
    }
}
//# sourceMappingURL=Files.js.map