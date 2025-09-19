# Development 👷

## Starters

Starters are folders containing files and structure that can be optionally added to the final created repository by `create-node-app` (cna). The base folder structure and tooling that should be available in every application created by cna is located in the [\_base](../starter/_base) folder.

Each additional starter is an addition to this base. When a user selects a specific starter, all contents are copied into the final directory **except for specific files that require content merging**. Every file that is merged uses its own merger defined in the [Mergers](../src/Mergers/) directory.

Each starter directory must contain a `node-app.jsonc` configuration file that defines the starter's metadata for the cna.

### Grouping and sorting

Starters are grouped into categories called "modules". These indicate that only one starter should be selected from each group. For example, under the API module there can be GraphQL and RESTful API starters, but the created application can have only one of those.

The order for injection into the final repository is alphabetical based on the module fields. The logic for grouping and sorting is as follows:

1. **Base Starter**: The `_base` starter is always built first
2. **Selected Starters**: Each selected starter is built in the order of user selection
3. **npm install**: Dependencies are installed
4. **Prebuild Scripts**: All `prebuild` scripts from selected starters are executed
5. **Final Build**: `npm run build` is executed

### Configuration

The `node-app.jsonc` file is a JSON with Comments file that configures how a starter behaves during the build process. The structure is as follows (fields with \* are required):

- `id`\* (`string`): Unique identifier
- `name`\* (`string`): Displayed in the CLI in the form of `<name> <module>` e.g. `RESTful API`
- `module`\* (`string`): The category this starter belongs to (e.g., "API", "database")
- `prebuild` (`string[]`): Array of npm script names to run before the main build
- `replace` (`string[]`): Array of file paths (relative to project root) where string replacements should be applied

#### Example RESTful API `node-app.jsonc`

```jsonc
{
  "module": "API",
  "id": "rest",
  "name": "RESTful",
  "prebuild": ["generate:api"],
}
```
