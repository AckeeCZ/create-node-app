"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageJson = void 0;
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const lodash = __importStar(require("lodash"));
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
    runScript(name) {
        this.npm.run(['run', name]);
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
        Logger_1.logger.info(`> package.json updated ${JSON.stringify(partialWith)}`);
        fs.writeFileSync(path.join(this.path), JSON.stringify(json, null, 2), 'utf-8');
    }
}
exports.PackageJson = PackageJson;
//# sourceMappingURL=PackageJson.js.map