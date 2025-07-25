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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CloudFunctionsStarter_1 = require("./cloudfunctions/CloudFunctionsStarter");
const CloudRunStarter_1 = require("./cloudrun/CloudRunStarter");
const Npm_1 = require("./Npm");
const Toolbelt_1 = require("./Toolbelt");
const path = __importStar(require("path"));
const PackageJson_1 = require("./PackageJson");
const GraphQLStarter_1 = require("./cloudrun-graphql/GraphQLStarter");
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
const Logger_1 = require("./Logger");
class Boostrap {
    constructor() {
        this.starters = [
            new CloudRunStarter_1.CloudRunStarter(),
            new CloudFunctionsStarter_1.CloudFunctionsStarter(),
            new GraphQLStarter_1.GraphQLStarter(),
        ];
    }
    runCLI(args) {
        const cli = (0, yargs_1.default)((0, helpers_1.hideBin)(args))
            .usage('create-node-app <starter> [options]')
            .positional('starter', {
            name: 'starter',
            type: 'string',
            required: true,
            description: 'Which template to setup (required)',
            choices: this.starters.map(starter => starter.name),
        })
            .option('dir', {
            type: 'string',
            alias: 'd',
            default: './node-app',
            description: 'Destination directory',
        })
            .option('project-name', {
            type: 'string',
            alias: 'n',
            default: 'node-app',
            description: 'Google Cloud project name',
        })
            .version('1.0.0')
            .help();
        const parsedArgs = cli.parseSync();
        const starterArg = parsedArgs._[0];
        const starter = this.starters.find(x => x.name === starterArg);
        const destination = path.normalize(parsedArgs.dir);
        if (!starter) {
            Logger_1.logger.info('Invalid starter');
            cli.showHelp();
            process.exit(1);
        }
        Logger_1.logger.info(`starter=${starter.name}, destination=${destination}`);
        const npm = new Npm_1.Npm({ dir: destination });
        const packageJson = new PackageJson_1.PackageJson(npm);
        const toolbelt = new Toolbelt_1.Toolbelt({
            npm,
            packageJson,
            assetDirectory: `${__filename}/../../starter/${starter.name}`,
            sharedDirectory: `${__filename}/../../starter/shared`,
            destination: destination,
            projectName: parsedArgs.projectName,
        });
        starter.setToolbelt(toolbelt);
        toolbelt.mkdir(destination, { overwrite: true });
        toolbelt.npm.init();
        starter.install();
    }
}
exports.default = Boostrap;
//# sourceMappingURL=Bootstrap.js.map