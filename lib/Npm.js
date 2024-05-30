"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const childProcess = require("child_process");
const Logger_1 = require("./Logger");
class Npm {
    constructor(settings) {
        this.dir = settings === null || settings === void 0 ? void 0 : settings.dir;
    }
    run(args) {
        var _a;
        Logger_1.default.info(`> npm ${args.join(' ')}`);
        const result = this.dir
            ? childProcess.spawnSync('npm', args, {
                cwd: this.dir,
            })
            : childProcess.spawnSync('npm', args);
        if (((_a = result === null || result === void 0 ? void 0 : result.status) !== null && _a !== void 0 ? _a : 0) > 0) {
            Logger_1.default.info(`Failed npm command: npm ${args.join(' ')}. ${String(result.output)}`);
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
exports.default = Npm;
//# sourceMappingURL=Npm.js.map