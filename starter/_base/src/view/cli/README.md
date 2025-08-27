# CLI

Cli tool to operate scripts that can use internal services or to add development toolkit with the same interface and usage. Currently cli tool is operated using tsx tool.

## 👷 Development

The CLI tool is build around `yargs` library. Each command needs its own `ts` file in current folder or in subfolder. The entrypoint `Cli.ts` scans the sub folders for `ts` files and intrerprets them as a command under the module called same as the folder. Each command should export only functions and variables according to `CommandDefinition` in [cli.ts file](./cli.ts).

For example, if you add `openapi` folder, it will creates a new module `openapi`. If you add a new command called `generate.ts`, it will also assign a new generate command to this module.

## ⚠️ Usage in production scripts

If the cli tool is used to run production scripts (CRON), make sure all dependencies are also listed in production list and build the code instead of using `tsx` (e.g. `yargs`).
