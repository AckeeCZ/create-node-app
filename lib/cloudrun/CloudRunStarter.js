export class CloudRunStarter {
  constructor() {
    this.name = 'cloudrun'
  }
  setToolbelt(toolbelt) {
    this.toolbelt = toolbelt
    return this
  }
  install() {
    if (this.toolbelt == null) {
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
    tb.replaceInFile(
      `ci-branch-config/common.env`,
      '{{PROJECT_NAME}}',
      tb.projectName
    )
    tb.copySharedAsset('ci-branch-config/development.env')
    tb.replaceInFile(
      `ci-branch-config/development.env`,
      '{{PROJECT_NAME}}',
      tb.projectName
    )
    tb.copySharedAsset('ci-branch-config/stage.env')
    tb.replaceInFile(
      `ci-branch-config/stage.env`,
      '{{PROJECT_NAME}}',
      tb.projectName
    )
    tb.copySharedAsset('ci-branch-config/master.env')
    tb.replaceInFile(
      `ci-branch-config/master.env`,
      '{{PROJECT_NAME}}',
      tb.projectName
    )
    tb.mkdir(tb.stringToPath(`${tb.destination}/docker-compose`))
    tb.copySharedAsset('docker-compose/docker-compose-entrypoint.sh')
    tb.copySharedAsset('docker-compose/docker-compose.ci.yml')
    tb.copySharedAsset('docker-compose/docker-compose.local.yml')
    tb.symlink(
      `${tb.destination}/docker-compose/docker-compose.override.yml`,
      `${tb.destination}/docker-compose/docker-compose.local.yml`
    )
    tb.copySharedAsset('docker-compose/docker-compose.yml')
    tb.replaceInFile(
      `docker-compose/docker-compose.yml`,
      '{{PROJECT_NAME}}',
      tb.projectName
    )
    tb.npm.iDev('typescript')
    tb.npm.iDev('@types/node')
    tb.npm.iDev('ts-node')
    tb.npm.i('source-map-support')
    tb.copySharedAsset('tsconfig.json')
    tb.packageJson.setType('module')
    tb.packageJson.addNpmScript('build', 'tsc')
    tb.packageJson.addNpmScript(
      'start',
      'node -r source-map-support/register dist/index.js'
    )
    tb.npm.i('configuru')
    tb.npm.i('pino')
    tb.npm.i('pino-http')
    tb.npm.iDev('pino-pretty')
    tb.copyAsset('.env.jsonc')
    tb.mkdir(tb.stringToPath(`${tb.destination}/src`))
    tb.copyAsset('src/config.ts')
    tb.mkdir(tb.stringToPath(`${tb.destination}/src/adapters`))
    tb.copyAsset('src/container.ts')
    tb.copyAsset('src/context.ts')
    tb.copyAsset('src/index.ts')
    tb.mkdir(tb.stringToPath(`${tb.destination}/src/view`))
    tb.copyAsset(`/src/view/server.ts`)
    tb.mkdir(tb.stringToPath(`${tb.destination}/src/view/rest`))
    tb.copyAsset(`/src/view/rest/request.d.ts`)
    tb.copyAsset(`/src/view/rest/routes.ts`)
    tb.mkdir(tb.stringToPath(`${tb.destination}/src/view/rest/controller`))
    tb.copyAsset(`/src/view/rest/controller/health-check.controller.ts`)
    tb.mkdir(tb.stringToPath(`${tb.destination}/src/view/rest/middleware`))
    tb.copyAsset(`/src/view/rest/middleware/context-middleware.ts`)
    tb.copyAsset(`/src/view/rest/middleware/error-handler.ts`)
    tb.copyAsset(`/src/view/rest/middleware/request-logger.ts`)
    tb.mkdir(tb.stringToPath(`${tb.destination}/src/view/rest/util`))
    tb.copyAsset(`/src/view/rest/util/openapi.util.ts`)
    tb.mkdir(tb.stringToPath(`${tb.destination}/src/view/rest/spec`))
    tb.copyAsset(`/src/view/rest/spec/openapi.yml`)
    tb.npm.i('node-healthz')
    tb.mkdir(tb.stringToPath(`${tb.destination}/src/domain`))
    tb.copyAsset('src/domain/health-check.service.ts')
    tb.mkdir(tb.stringToPath(`${tb.destination}/src/domain/errors`))
    tb.copyAsset('src/domain/errors/errors.ts')
    tb.copyAsset('src/domain/errors/codes.ts')
    tb.mkdir(tb.stringToPath(`${tb.destination}/src/domain/util`))
    tb.mkdir(tb.stringToPath(`${tb.destination}/src/domain/ports`))
    tb.copyAsset('src/domain/ports/logger.d.ts')
    tb.mkdir(tb.stringToPath(`${tb.destination}/src/adapters`))
    tb.copyAsset('src/adapters/pino.logger.ts')
    tb.npm.i('express')
    tb.npm.iDev('@types/express')
    tb.npm.iDev('mocha')
    tb.npm.iDev('mocha-junit-reporter')
    tb.npm.iDev('mocha-multi-reporters')
    tb.npm.iDev('nyc')
    tb.npm.iDev('@types/mocha')
    tb.npm.iDev('@istanbuljs/nyc-config-typescript')
    tb.npm.iDev('supertest')
    tb.npm.iDev('@types/supertest')
    tb.copySharedAsset('.mocharc.json', tb.destination)
    tb.copySharedAsset('.mocha-junit-config.json', tb.destination)
    tb.packageJson.addNpmScript('test', 'mocha')
    tb.packageJson.addNpmScript(
      'ci-test:no-coverage',
      'npm run test -- --parallel=false -R mocha-multi-reporters --reporter-options configFile=.mocha-junit-config.json'
    )
    tb.packageJson.addNpmScript(
      'ci-test',
      'nyc -a -r cobertura --report-dir output npm run ci-test:no-coverage'
    )
    tb.mkdir(tb.stringToPath(`${tb.destination}/src/test`))
    tb.copySharedAsset('src/test/setup.ts')
    tb.copyAsset('src/test/health-check.test.ts')
    tb.mkdir(tb.stringToPath(`${tb.destination}/src/test/util`))
    tb.copyAsset('src/test/util/openapi-test.util.ts')
    tb.npm.iDev('@ackee/styleguide-backend-config')
    tb.npm.iDev('prettier')
    tb.npm.iDev('eslint')
    tb.npm.iDev('eslint-formatter-gitlab@^5.0.0')
    tb.copyAsset('.eslint.tsconfig.json')
    tb.copyAsset('.eslintrc.cjs')
    tb.copySharedAsset('prettier.config.cjs')
    tb.packageJson.addNpmScript(
      'prettier',
      "prettier --check --write '**/*.{ts,js,json,md}'"
    )
    tb.packageJson.addNpmScript('lint', "eslint '**/*.ts' -f codeframe --fix")
    tb.packageJson.addNpmScript('codestyle', 'npm run prettier && npm run lint')
    tb.packageJson.addNpmScript(
      'ci-lint',
      'npm run lint -- -f checkstyle -o ./output/checkstyle-result.xml'
    )
    tb.mkdir(tb.stringToPath(`${tb.destination}/src/view/cli`))
    tb.copyAsset('src/view/cli/cli.ts')
    tb.copyAsset('src/view/cli/README.md')
    tb.mkdir(tb.stringToPath(`${tb.destination}/src/view/cli/openapi`))
    tb.copyAsset('src/view/cli/openapi/generate.ts')
    tb.npm.iDev('yargs')
    tb.npm.iDev('yaml')
    tb.packageJson.addNpmScript('cli', 'tsx ./src/view/cli/cli.ts')
    tb.npm.iDev('openapi-typescript')
    tb.npm.iDev('tsx')
    tb.packageJson.addNpmScript(
      'generate:api',
      'npm run cli openapi generate src/view/rest/spec/openapi.yml && npm run codestyle'
    )
    tb.packageJson.runScript('generate:api')
    tb.packageJson.runScript('build')
  }
}
//# sourceMappingURL=CloudRunStarter.js.map
