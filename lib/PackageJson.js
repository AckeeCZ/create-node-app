"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const lodash = require("lodash");
const Logger_1 = require("./Logger");
class PackageJson {
    constructor(npm) {
        let packagejsonPath = './package.json';
        if (npm.dir) {
            packagejsonPath = path.normalize(`${npm.dir}/${packagejsonPath}`);
        }
        this.path = packagejsonPath;
        this.npm = npm;
    }
    toJSON() {
        return JSON.parse(fs.readFileSync(this.path, 'utf-8'));
    }
    runScript(name, options) {
        return this.npm.run(['run', name], options);
    }
    addNpmScript(name, command) {
        this.mergeWith({
            scripts: {
                [name]: command,
            },
        });
    }
    // Updated package json using merge with given object
    mergeWith(partialWith) {
        const json = lodash.merge(this.toJSON(), partialWith);
        Logger_1.default.info(`> package.json updated ${JSON.stringify(partialWith)}`);
        fs.writeFileSync(path.join(this.path), JSON.stringify(json, null, 2), 'utf-8');
    }
}
exports.default = PackageJson;
//# sourceMappingURL=PackageJson.js.map