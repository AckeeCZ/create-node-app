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
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
class Framework {
    constructor(param) {
        this.starters = param.starters;
    }
    runCLI(args) {
        const parsed = this.parseCLIArgs(args);
        this.printLn(`starter=${parsed.starter.name}, destination=${parsed.destination}`);
        parsed.starter.install({
            destination: parsed.destination,
            framework: this,
        });
    }
    printLn(str) {
        console.log(str);
    }
    parseCLIArgs(args) {
        try {
            const starterArg = args[2];
            const starter = this.starters.find(x => x.name === starterArg);
            if (!starter) {
                this.printLn('Invalid starter');
                this.printCLIHelp();
                process.exit(1);
            }
            const destination = args[3];
            return {
                starter,
                destination: path.normalize(destination !== null && destination !== void 0 ? destination : './node-app'),
            };
        }
        catch (error) {
            this.printLn(`Failed to parse args. ${error === null || error === void 0 ? void 0 : error.stack}`);
            this.printCLIHelp();
            process.exit(1);
        }
    }
    printCLIHelp() {
        this.printLn(`
Usage: npx github:AckeeCZ/create-node-app STARTER [DIRECTORY]

STARTER        Which template to setup
DIRECTORY      Destination directory where to set the starter up (default: ./node-app)

Starters available:
    cloudrun        Cloud Run + express
`);
    }
    mkdir(dirpath, option) {
        const p = path.join(...dirpath);
        if (fs.existsSync(path.join(p)) && (option === null || option === void 0 ? void 0 : option.overwrite)) {
            fs.rmSync(p, { recursive: true });
        }
        fs.mkdirSync(p);
    }
}
exports.default = Framework;
