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
    tb.copyAsset('.gitignore', tb.destination)
    tb.copyAsset('.gitlab-ci.yml', tb.destination)
    tb.copyAsset('.nvmrc', tb.destination)
    tb.copyAsset('Dockerfile', tb.destination)
    tb.copyAsset('.dockerignore', tb.destination)

    tb.mkdir(tb.stringToPath(`${tb.destination}/ci-branch-config`))
    tb.copyAsset(
      'ci-branch-config/common.env',
      tb.stringToPath(`${tb.destination}/ci-branch-config`)
    )
    tb.copyAsset(
      'ci-branch-config/development.env',
      tb.stringToPath(`${tb.destination}/ci-branch-config`)
    )
    tb.copyAsset(
      'ci-branch-config/stage.env',
      tb.stringToPath(`${tb.destination}/ci-branch-config`)
    )
    tb.copyAsset(
      'ci-branch-config/master.env',
      tb.stringToPath(`${tb.destination}/ci-branch-config`)
    )

    tb.mkdir(tb.stringToPath(`${tb.destination}/docker-compose`))
    tb.copyAsset(
      'docker-compose/docker-compose-entrypoint.sh',
      tb.stringToPath(`${tb.destination}/docker-compose`)
    )
    tb.copyAsset(
      'docker-compose/docker-compose.ci.yml',
      tb.stringToPath(`${tb.destination}/docker-compose`)
    )
    tb.copyAsset(
      'docker-compose/docker-compose.local.yml',
      tb.stringToPath(`${tb.destination}/docker-compose`)
    )
    tb.copyAsset(
      'docker-compose/docker-compose.override.yml',
      tb.stringToPath(`${tb.destination}/docker-compose`)
    )
    tb.copyAsset(
      'docker-compose/docker-compose.yml',
      tb.stringToPath(`${tb.destination}/docker-compose`)
    )

    tb.npm.iDev('typescript')
    tb.npm.iDev('@types/node')
    tb.npm.i('source-map-support')
    tb.copyAsset('tsconfig.json', tb.destination)
    tb.packageJson.addNpmScript('build', 'tsc')
    tb.packageJson.addNpmScript(
      'start',
      'node -r source-map-support/register dist/index.js'
    )

    tb.npm.i('configuru')
    tb.npm.i('cosmas')
    tb.copyAsset('.env.jsonc', tb.destination)
    tb.mkdir(tb.stringToPath(`${tb.destination}/src`))
    tb.copyAsset('src/config.ts', tb.stringToPath(`${tb.destination}/src`))
    tb.copyAsset('src/logger.ts', tb.stringToPath(`${tb.destination}/src`))
    tb.copyAsset('src/index.ts', tb.stringToPath(`${tb.destination}/src`))

    tb.npm.iDev('jest')
    tb.npm.iDev('@types/jest')
    tb.npm.iDev('ts-jest')
    tb.npm.iDev('jest-junit')
    tb.copyAsset('jest.config.js', tb.destination)
    tb.packageJson.addNpmScript('test', 'jest --colors --detectOpenHandles')
    tb.packageJson.addNpmScript(
      'ci-test',
      'npm run test -- --collectCoverage --reporters=default --reporters=jest-junit --ci'
    )
    tb.mkdir(tb.stringToPath(`${tb.destination}/src/test`))
    tb.copyAsset(
      'src/test/helloWorld.test.ts',
      tb.stringToPath(`${tb.destination}/src/test`)
    )

    tb.npm.iDev('@ackee/styleguide-backend-config')
    tb.npm.iDev('prettier')
    tb.npm.iDev('eslint')
    tb.copyAsset('.eslint.tsconfig.json', tb.destination)
    tb.copyAsset('.eslintrc.js', tb.destination)
    tb.copyAsset('prettier.config.js', tb.destination)

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

    // TODO: these 2 add to the end of starter?
    tb.packageJson.runScript('build')
    tb.packageJson.runScript('start')
    // TODO: these 2 add to the end of starter?
    tb.packageJson.runScript('test')
    tb.packageJson.runScript('ci-test')

    tb.packageJson.runScript('codestyle')
    tb.packageJson.runScript('ci-lint')
  }
}
