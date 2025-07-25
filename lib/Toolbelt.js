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
exports.Toolbelt = void 0;
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const Logger_1 = require("./Logger");
class Toolbelt {
    constructor(params) {
        this.npm = params.npm;
        this.packageJson = params.packageJson;
        this.assetDirectory = params.assetDirectory;
        this.sharedDirectory = params.sharedDirectory;
        this.destination = params.destination;
        this.projectName = params.projectName;
    }
    stringToPath(str) {
        return path.normalize(str);
    }
    mkdir(dirpath, option) {
        dirpath = this.stringToPath(dirpath);
        const rootPath = ['.', './'];
        if (!rootPath.includes(dirpath)) {
            if (fs.existsSync(dirpath) && option?.overwrite) {
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
        a = this.stringToPath(a);
        b = this.stringToPath(b);
        const file = path.basename(a);
        this.cp(a, this.stringToPath(`${b}/${option?.destFileName ?? file}`));
    }
    cp(a, b) {
        a = this.stringToPath(a);
        b = this.stringToPath(b);
        Logger_1.logger.info(`> cp ${a} ${b}`);
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
    replaceInFile(filePath, placeholder, replacement = 'REPLACEME') {
        filePath = this.stringToPath(`${this.destination}/${filePath}`);
        let content = fs.readFileSync(filePath, 'utf8');
        /* eslint-disable-next-line security/detect-non-literal-regexp */
        content = content.replace(new RegExp(placeholder, 'g'), replacement);
        fs.writeFileSync(filePath, content);
    }
    symlink(linkName, linkedFile) {
        linkName = this.stringToPath(linkName);
        linkedFile = this.stringToPath(linkedFile);
        Logger_1.logger.info(`> ln -s ${linkName} ${linkedFile}`);
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
exports.Toolbelt = Toolbelt;
//# sourceMappingURL=Toolbelt.js.map