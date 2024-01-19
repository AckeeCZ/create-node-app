import Starter from '../Starter'
import Toolbelt from '../Toolbelt'

export default class CloudRunStarter implements Starter {
  public readonly name = 'cloudrun'
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
    tb.copyAsset('.gitignore')
    tb.copyAsset('.gitlab-ci.yml')
    tb.copyAsset('.nvmrc')
    tb.copyAsset('Dockerfile')
    tb.copyAsset('.dockerignore')

    tb.mkdir(tb.stringToPath(`${tb.destination}/ci-branch-config`))
    tb.copyAsset('ci-branch-config/common.env')
    tb.copyAsset('ci-branch-config/development.env')
    tb.copyAsset('ci-branch-config/stage.env')
    tb.copyAsset('ci-branch-config/master.env')

    tb.mkdir(tb.stringToPath(`${tb.destination}/docker-compose`))
    tb.copyAsset('docker-compose/docker-compose-entrypoint.sh')
    tb.copyAsset('docker-compose/docker-compose.ci.yml')
    tb.copyAsset('docker-compose/docker-compose.local.yml')
    tb.symlink(
      `${tb.destination}/docker-compose/docker-compose.override.yml`,
      `${tb.destination}/docker-compose/docker-compose.local.yml`
    )
    tb.copyAsset('docker-compose/docker-compose.yml')

    tb.npm.iDev('typescript')
    tb.npm.iDev('@types/node')
    tb.npm.i('source-map-support')
    tb.copyAsset('tsconfig.json')
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
    tb.npm.iDev('ts-mocha')
    tb.npm.iDev('mocha-junit-reporter')
    tb.npm.iDev('@types/mocha')
    tb.copyAsset('.mocharc.json', tb.destination)
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
    tb.copyAsset('prettier.config.js')

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
