import Starter from '../Starter'
import Toolbelt from '../Toolbelt'

export default class CloudRunStarter implements Starter {
  public readonly name = 'cloudrun-graphql'
  protected toolbelt?: Toolbelt
  setToolbelt(toolbelt: Toolbelt): Starter {
    this.toolbelt = toolbelt
    return this
  }
  public install(): void {
    if (!this.toolbelt) {
      throw new Error('No toolbelt')
    }
    const tb = this.toolbelt
    tb.copySharedAsset('.gitignore')
    tb.copySharedAsset('.gitlab-ci.yml')
    tb.copySharedAsset('.nvmrc')
    tb.copySharedAsset('Dockerfile')
    tb.copySharedAsset('.dockerignore')

    tb.mkdir(tb.stringToPath(`${tb.destination}/ci-branch-config`))
    tb.copySharedAsset('ci-branch-config/common.env')
    tb.copySharedAsset('ci-branch-config/development.env')
    tb.copySharedAsset('ci-branch-config/stage.env')
    tb.copySharedAsset('ci-branch-config/master.env')

    tb.mkdir(tb.stringToPath(`${tb.destination}/docker-compose`))
    tb.copySharedAsset('docker-compose/docker-compose-entrypoint.sh')
    tb.copySharedAsset('docker-compose/docker-compose.ci.yml')
    tb.copySharedAsset('docker-compose/docker-compose.local.yml')
    tb.copySharedAsset('docker-compose/docker-compose.override.yml')
    tb.symlink(
      `${tb.destination}/docker-compose/docker-compose.override.yml`,
      `${tb.destination}/docker-compose/docker-compose.local.yml`
    )
    tb.copySharedAsset('docker-compose/docker-compose.yml')

    tb.npm.iDev('typescript')
    tb.npm.iDev('@types/node')
    tb.npm.i('source-map-support')
    tb.copySharedAsset('tsconfig.json')
    tb.packageJson.addNpmScript(
      'build:graphql-types',
      'graphql-codegen --config codegen.yml'
    )
    tb.packageJson.addNpmScript(
      'build:copy-schema',
      'mkdir -p ./dist/app/api/graphql/schema && cp -r ./src/app/api/graphql/schema ./dist/app/api/graphql/schema'
    )
    tb.packageJson.addNpmScript(
      'build',
      'npm run build:graphql-types && npm run build:copy-schema && tsc'
    )
    tb.packageJson.addNpmScript(
      'start',
      'node -r source-map-support/register dist/index.js'
    )

    tb.npm.i('configuru')
    tb.npm.i('pino')
    tb.npm.iDev('pino-pretty')
    tb.copyAsset('.env.jsonc')
    tb.mkdir(tb.stringToPath(`${tb.destination}/src`))
    tb.mkdir(tb.stringToPath(`${tb.destination}/src/app`))
    tb.mkdir(tb.stringToPath(`${tb.destination}/src/app/api`))
    tb.mkdir(tb.stringToPath(`${tb.destination}/src/app/api/graphql`))
    tb.mkdir(tb.stringToPath(`${tb.destination}/src/app/api/graphql/resolvers`))
    tb.mkdir(tb.stringToPath(`${tb.destination}/src/app/api/graphql/schema`))
    tb.copyAsset('src/config.ts')
    tb.copyAsset('src/logger.ts')
    tb.copyAsset('src/index.ts')
    tb.copyAsset('codegen.yml')

    tb.copyAsset('src/app/server.ts')
    tb.copyAsset('src/app/controller.ts')
    tb.copyAsset('src/app/api/graphql/schema.ts')
    tb.copyAsset('src/app/api/graphql/resolvers.ts')
    tb.copyAsset('src/app/api/graphql/resolvers/greeting.resolver.ts')
    tb.copyAsset('src/app/api/graphql/schema/schema.graphql')

    tb.npm.iDev('mocha')
    tb.npm.iDev('ts-mocha')
    tb.npm.iDev('mocha-junit-reporter')
    tb.npm.iDev('@types/mocha')
    tb.copySharedAsset('.mocharc.json', tb.destination)
    tb.packageJson.addNpmScript('test', 'ts-mocha')
    tb.packageJson.addNpmScript(
      'ci-test',
      'npm run test -- --parallel=false -R mocha-junit-reporter -O=mochaFile=./output/text.xml'
    )
    tb.mkdir(tb.stringToPath(`${tb.destination}/src/test`))
    tb.copyAsset('src/test/helloWorld.test.ts')

    tb.npm.iDev('@ackee/styleguide-backend-config')
    tb.npm.iDev('prettier')
    tb.npm.iDev('eslint')
    tb.copyAsset('.eslint.tsconfig.json')
    tb.copyAsset('.eslintrc.js')
    tb.copySharedAsset('prettier.config.js')

    tb.packageJson.addNpmScript(
      'prettier',
      "prettier --check --write '**/*.{ts,js,json,md}'"
    )
    tb.packageJson.addNpmScript(
      'lint',
      'eslint --ext .ts --ext .graphql src -f codeframe --fix'
    )
    tb.packageJson.addNpmScript('codestyle', 'npm run prettier && npm run lint')
    tb.packageJson.addNpmScript(
      'ci-lint',
      'npm run lint -- -f checkstyle -o ./output/checkstyle-result.xml'
    )

    tb.npm.i('@apollo/server')
    tb.npm.iDev('@graphql-codegen/cli')
    tb.npm.iDev('lodash')
    tb.npm.iDev('@graphql-eslint/eslint-plugin')
    tb.npm.iDev('@graphql-codegen/typescript')
    tb.npm.iDev('@graphql-codegen/typescript-resolvers')
    tb.npm.i('@graphql-tools/load-files')
    tb.npm.i('@graphql-tools/merge')
    tb.npm.i('@graphql-tools/schema')
    tb.npm.i('graphql')
    tb.npm.i('express')
    tb.npm.i('graphql-middleware')

    tb.packageJson.runScript('build')
  }
}
