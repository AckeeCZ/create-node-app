'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
class CloudRunStarter {
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
    tb.copySharedAsset('ci-branch-config/development.env')
    tb.copySharedAsset('ci-branch-config/stage.env')
    tb.copySharedAsset('ci-branch-config/master.env')
    tb.mkdir(tb.stringToPath(`${tb.destination}/docker-compose`))
    tb.copySharedAsset('docker-compose/docker-compose-entrypoint.sh')
    tb.copySharedAsset('docker-compose/docker-compose.ci.yml')
    tb.copySharedAsset('docker-compose/docker-compose.local.yml')
    tb.symlink(
      `${tb.destination}/docker-compose/docker-compose.override.yml`,
      `${tb.destination}/docker-compose/docker-compose.local.yml`
    )
    tb.copySharedAsset('docker-compose/docker-compose.yml')
    tb.npm.iDev('typescript')
    tb.npm.iDev('@types/node')
    tb.npm.iDev('ts-node')
    tb.npm.i('source-map-support')
    tb.copySharedAsset('tsconfig.json')
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
    tb.copyAsset('src/logger.ts')
    tb.copyAsset('src/index.ts')
    tb.mkdir(tb.stringToPath(`${tb.destination}/src/app`))
    tb.mkdir(tb.stringToPath(`${tb.destination}/src/app/errors`))
    tb.mkdir(tb.stringToPath(`${tb.destination}/src/app/util`))
    tb.copyAsset('src/app/server.ts')
    tb.copyAsset('src/app/errors/index.ts')
    tb.copyAsset('src/app/errors/DomainError.ts')
    tb.copyAsset('src/app/errors/errorCode.ts')
    tb.copyAsset('src/app/util/express.util.ts')
    tb.copyAsset('src/app/util/index.ts')
    tb.npm.i('express')
    tb.npm.iDev('@types/express')
    tb.npm.iDev('mocha')
    tb.npm.iDev('mocha-junit-reporter')
    tb.npm.iDev('@types/mocha')
    tb.copySharedAsset('.mocharc.json', tb.destination)
    tb.packageJson.addNpmScript('test', 'mocha')
    tb.packageJson.addNpmScript(
      'ci-test',
      'npm run test -- --parallel=false -R mocha-junit-reporter -O=mochaFile=./output/test.xml'
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
    tb.packageJson.addNpmScript('lint', "eslint '**/*.ts' -f codeframe --fix")
    tb.packageJson.addNpmScript('codestyle', 'npm run prettier && npm run lint')
    tb.packageJson.addNpmScript(
      'ci-lint',
      'npm run lint -- -f checkstyle -o ./output/checkstyle-result.xml'
    )
    tb.packageJson.runScript('build')
  }
}
exports.default = CloudRunStarter
//# sourceMappingURL=CloudRunStarter.js.map
