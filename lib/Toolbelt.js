"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const Logger_1 = require("./Logger");
class Toolbelt {
    constructor(params) {
        this.npm = params.npm;
        this.packageJson = params.packageJson;
        this.assetDirectory = params.assetDirectory;
        this.sharedDirectory = params.sharedDirectory;
        this.destination = params.destination;
    }
    stringToPath(str) {
        return path.normalize(str);
    }
    mkdir(dirpath, option) {
        dirpath = this.stringToPath(dirpath);
        const rootPath = ['.', './'];
        if (!rootPath.includes(dirpath)) {
            if (fs.existsSync(dirpath) && (option === null || option === void 0 ? void 0 : option.overwrite)) {
                fs.rmSync(dirpath, { recursive: true });
            }
            fs.mkdirSync(dirpath);
        }
    }
    /**
     * Like cp, but second argument does not need to include file name
     * the name is preserved.
     */
    cpFile(a, b, option) {
        var _a;
        a = this.stringToPath(a);
        b = this.stringToPath(b);
        const file = path.basename(a);
        this.cp(a, this.stringToPath(`${b}/${(_a = option === null || option === void 0 ? void 0 : option.destFileName) !== null && _a !== void 0 ? _a : file}`));
    }
    cp(a, b) {
        a = this.stringToPath(a);
        b = this.stringToPath(b);
        Logger_1.default.info(`> cp ${a} ${b}`);
        fs.copyFileSync(a, b);
    }
    copyAsset(name, destination) {
        let destinationName = name;
        if (path.basename(name) === '.gitignore') {
            name = '.gitignore_';
            destinationName = '.gitignore';
        }
        name = this.stringToPath(name);
        destination = this.stringToPath(this.destination);
        this.cpFile(`${this.assetDirectory}/${name}`, destination, {
            destFileName: destinationName,
        });
    }
    copySharedAsset(name, destination) {
        let destinationName = name;
        if (path.basename(name) === '.gitignore') {
            name = '.gitignore_';
            destinationName = '.gitignore';
        }
        name = this.stringToPath(name);
        destination = this.stringToPath(this.destination);
        this.cpFile(`${this.sharedDirectory}/${name}`, destination, {
            destFileName: destinationName,
        });
    }
    symlink(linkName, linkedFile) {
        linkName = this.stringToPath(linkName);
        linkedFile = this.stringToPath(linkedFile);
        Logger_1.default.info(`> ln -s ${linkName} ${linkedFile}`);
        try {
            fs.symlinkSync(linkedFile, linkName);
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
exports.default = Toolbelt;
//# sourceMappingURL=Toolbelt.js.map