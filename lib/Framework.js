"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const childProcess = require("child_process");
const lodash = require("lodash");
class Framework {
    constructor(param) {
        this.starters = param.starters;
    }
    runCLI(args) {
        const parsed = this.parseCLIArgs(args);
        this.printLn(`starter=${parsed.starter.name}, destination=${parsed.destination}`);
        this.mkdir(parsed.destination, { overwrite: true });
        const npm = this.createNpmReference({ dir: parsed.destination });
        this.npmInit(npm);
        const packageJson = this.createPackageJsonReference(npm);
        parsed.starter.install({
            destination: parsed.destination,
            framework: this,
            npm,
            packageJson,
            asset(input) {
                return path.normalize(`${__filename}/../../starter/${parsed.starter.name}/${input}`);
            },
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
        if (fs.existsSync(dirpath) && (option === null || option === void 0 ? void 0 : option.overwrite)) {
            fs.rmSync(dirpath, { recursive: true });
        }
        fs.mkdirSync(dirpath);
    }
    createNpmReference(settings) {
        return {
            dir: settings === null || settings === void 0 ? void 0 : settings.dir,
            run: args => {
                var _a;
                this.printLn(`> npm ${args.join(' ')}`);
                const result = (settings === null || settings === void 0 ? void 0 : settings.dir)
                    ? childProcess.spawnSync('npm', args, {
                        cwd: settings.dir,
                    })
                    : childProcess.spawnSync('npm', args);
                if (((_a = result === null || result === void 0 ? void 0 : result.status) !== null && _a !== void 0 ? _a : 0) > 0) {
                    this.printLn(`Failed npm command: npm ${args.join(' ')}. ${String(result.output)}`);
                }
            },
        };
    }
    npmInit(npm) {
        npm.run(['init', '--yes']);
    }
    npmi(npm, module) {
        if (!module) {
            return npm.run(['i']);
        }
        const args = ['i', module];
        npm.run(args);
    }
    npmiDev(npm, module) {
        const args = ['i', '-D', module];
        npm.run(args);
    }
    /**
     * Like cp, but second argument does not need to include file name
     * the name is preserved.
     */
    cpFile(a, b) {
        const file = path.basename(a);
        this.cp(a, path.normalize(`${b}/${file}`));
    }
    cp(a, b) {
        this.printLn(`> cp ${a} ${b}`);
        fs.copyFileSync(a, b);
    }
    createPackageJsonReference(npm) {
        let packagejsonPath = './package.json';
        if (npm.dir) {
            packagejsonPath = path.normalize(`${npm.dir}/${packagejsonPath}`);
        }
        const json = () => JSON.parse(fs.readFileSync(packagejsonPath, 'utf-8'));
        return {
            path: packagejsonPath,
            json: () => json(),
            runScript: (name) => {
                npm.run(['run', name]);
            },
        };
    }
    addNpmScript(packageJson, name, command) {
        this.updatePackageJson(packageJson, {
            scripts: {
                [name]: command,
            },
        });
    }
    // Updated package json using merge with given object
    updatePackageJson(packageJson, obj) {
        const json = lodash.merge(packageJson.json(), obj);
        this.printLn(`> package.json updated ${JSON.stringify(obj)}`);
        fs.writeFileSync(path.join(packageJson.path), JSON.stringify(json, null, 2), 'utf-8');
    }
}
exports.default = Framework;
//# sourceMappingURL=Framework.js.map