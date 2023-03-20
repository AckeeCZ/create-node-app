"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CloudFunctionsStarter_1 = require("./cloudfunctions/CloudFunctionsStarter");
const CloudRunStarter_1 = require("./cloudrun/CloudRunStarter");
const Npm_1 = require("./Npm");
const Toolbelt_1 = require("./Toolbelt");
const path = require("path");
const PackageJson_1 = require("./PackageJson");
class Boostrap {
    constructor() {
        this.starters = [new CloudRunStarter_1.default(), new CloudFunctionsStarter_1.default()];
    }
    runCLI(args) {
        const parsed = this.parseCLIArgs(args);
        this.printLn(`starter=${parsed.starter.name}, destination=${parsed.destination}`);
        const npm = new Npm_1.default({ dir: parsed.destination });
        const packageJson = new PackageJson_1.default(npm);
        const toolbelt = new Toolbelt_1.default({
            npm,
            packageJson,
            assetDirectory: `${__filename}/../../starter/${parsed.starter.name}`,
            destination: parsed.destination,
        });
        parsed.starter.setToolbelt(toolbelt);
        toolbelt.mkdir(parsed.destination, { overwrite: true });
        toolbelt.npm.init();
        parsed.starter.install();
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
        cloudfunctions  Cloud Functions + graphql
    `);
    }
}
exports.default = Boostrap;
//# sourceMappingURL=Bootstrap.js.map