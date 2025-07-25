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
exports.Npm = void 0;
const childProcess = __importStar(require("child_process"));
const Logger_1 = require("./Logger");
class Npm {
    constructor(settings) {
        this.dir = settings?.dir;
    }
    run(args) {
        Logger_1.logger.info(`> npm ${args.join(' ')}`);
        const result = this.dir
            ? childProcess.spawnSync('npm', args, {
                cwd: this.dir,
            })
            : childProcess.spawnSync('npm', args);
        if ((result?.status ?? 0) > 0) {
            Logger_1.logger.info(`Failed npm command: npm ${args.join(' ')}. ${String(result.output)}`);
        }
    }
    init() {
        this.run(['init', '--yes']);
    }
    i(module) {
        if (!module) {
            return this.run(['i']);
        }
        const args = ['i', module];
        this.run(args);
    }
    iDev(module) {
        const args = ['i', '-D', module];
        this.run(args);
    }
}
exports.Npm = Npm;
//# sourceMappingURL=Npm.js.map