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
        this.destination = params.destination;
    }
    stringToPath(str) {
        return path.normalize(str);
    }
    mkdir(dirpath, option) {
        dirpath = this.stringToPath(dirpath);
        if (fs.existsSync(dirpath) && (option === null || option === void 0 ? void 0 : option.overwrite)) {
            fs.rmSync(dirpath, { recursive: true });
        }
        fs.mkdirSync(dirpath);
    }
    /**
* Like cp, but second argument does not need to include file name
* the name is preserved.
*/
    cpFile(a, b) {
        a = this.stringToPath(a);
        b = this.stringToPath(b);
        const file = path.basename(a);
        this.cp(a, this.stringToPath(`${b}/${file}`));
    }
    cp(a, b) {
        a = this.stringToPath(a);
        b = this.stringToPath(b);
        Logger_1.default.info(`> cp ${a} ${b}`);
        fs.copyFileSync(a, b);
    }
    copyAsset(name, destination) {
        name = this.stringToPath(name);
        destination = this.stringToPath(destination);
        this.cpFile(`${this.assetDirectory}/${name}`, destination);
    }
}
exports.default = Toolbelt;
//# sourceMappingURL=Toolbelt.js.map