import glob from 'fast-glob';
import * as fs from 'fs/promises';
import * as path from 'path';
import { PackageJsonMerger } from './Mergers/PackageJsonMerger.js';
import { EnvJsoncMerger } from './Mergers/EnvJsoncMerger.js';
import { ConfigMerger } from './Mergers/ConfigMerger.js';
import { ContainerMerger } from './Mergers/ContainerMerger.js';
import { Files } from './Files.js';
export class Builder {
    constructor(params) {
        this.npm = params.npm;
        this.logger = params.logger;
        this.starters = params.starters;
        this.destination = params.destination;
        this.projectName = params.projectName;
        this.replacements = {
            '{{PROJECT_NAME}}': this.projectName,
        };
        this.fileMergers = [
            new PackageJsonMerger(this.projectName, this.destination, 'package.json'),
            new EnvJsoncMerger(this.destination, '.env.jsonc'),
            new ConfigMerger(this.destination, 'src/config.ts'),
            new ContainerMerger(this.destination, 'src/container.ts'),
        ];
    }
    async prepareFolder() {
        if (await Files.existsAndIsDir(this.destination)) {
            await fs.rm(this.destination, { recursive: true });
        }
        await fs.mkdir(this.destination, { recursive: true });
    }
    async build() {
        try {
            await this.logger.loader(`Preparing clean folder`, this.prepareFolder());
            await this.logger.loader(`Preparing folder structure`, this.buildStarter(Builder.BASE_STARTER_DIR));
            for (const starter of this.starters) {
                await this.logger.loader(`Adding ${starter.config.name} ${starter.config.module}`, this.buildStarter(starter.path, starter.config));
            }
            await this.logger.loader(`npm install`, this.npm.run(['install']));
            const prebuildScripts = this.starters
                .map(starter => starter.config.prebuild)
                .filter(script => script !== undefined);
            for (const script of prebuildScripts) {
                await this.logger.loader(`npm run ${script.join(' ')}`, this.npm.run(['run', ...script]));
            }
            await this.logger.loader(`npm run build`, this.npm.run(['run', 'build']));
            this.logger.info(`Your app is ready in ${path.relative(process.cwd(), this.destination)}! 🚀`);
        }
        catch (error) {
            this.logger.error(error);
            process.exit(1);
        }
    }
    async buildStarter(starterDir, config) {
        const destDir = path.normalize(path.join(process.cwd(), this.destination));
        const files = await glob(`${starterDir}/*`, {
            cwd: starterDir,
            dot: true,
            onlyFiles: false,
        });
        const ignoredFiles = Builder.INGORED_FILES.map(file => path.join(starterDir, file));
        const mergedFiles = await Promise.all(this.fileMergers.map(async (merger) => {
            return {
                path: merger.getDestPath(),
                content: await merger.merge(starterDir),
            };
        }));
        await Promise.all(files.map(async (filePath) => {
            if (ignoredFiles.includes(filePath)) {
                return;
            }
            const destFilePath = path.join(destDir, path.basename(filePath));
            if (await Files.existsAndIsDir(filePath)) {
                await fs.cp(filePath, destFilePath, { recursive: true });
                return;
            }
            await fs.cp(filePath, destFilePath);
        }));
        await Promise.all(mergedFiles.map(async ({ path, content }) => fs.writeFile(path, content)));
        if (config?.replace) {
            await Promise.all(config.replace.map(async (filePath) => this.replaceInFile(filePath)));
        }
    }
    async replaceInFile(filePath) {
        filePath = path.normalize(path.join(this.destination, filePath));
        let content = await fs.readFile(filePath, 'utf8');
        content = Object.keys(this.replacements).reduce((acc, key) => {
            return acc.replaceAll(key, this.replacements[key]);
        }, content);
        return fs.writeFile(filePath, content);
    }
    async symlink(linkName, linkedFile) {
        linkName = path.normalize(linkName);
        linkedFile = path.normalize(linkedFile);
        this.logger.info(`> ln -s ${linkName} ${linkedFile}`);
        try {
            await fs.symlink(linkedFile, linkName);
        }
        catch (error) {
            if ('code' in error && error.code === 'EEXIST') {
                // OK
            }
            else {
                throw error;
            }
        }
    }
}
Builder.BASE_STARTER_DIR = path.normalize(path.join(import.meta.dirname, '..', 'starter', '_base'));
Builder.INGORED_FILES = ['node-app.jsonc'];
//# sourceMappingURL=Builder.js.map