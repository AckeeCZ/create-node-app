import Starter from '../Starter'
import Toolbelt from '../Toolbelt'

export default class CloudFunctionsStarter implements Starter {
  public readonly name = 'cloudfunctions'
  protected toolbelt?: Toolbelt
  setToolbelt(toolbelt: Toolbelt): Starter {
    this.toolbelt = toolbelt
    return this
  }
  install() {
    if (!this.toolbelt) {
      throw new Error('No toolbelt')
    }
    const tb = this.toolbelt
    tb.packageJson.mergeWith({
      main: 'lib/index.js',
      engines: {
        node: '16',
      },
    })
    tb.copyAsset('.dockerignore', tb.destination)
    tb.copyAsset('.gitignore', tb.destination)
    tb.copyAsset('.nvmrc', tb.destination)
    tb.copyAsset('Dockerfile', tb.destination)
    tb.copyAsset('firebase.json', tb.destination)

    tb.npm.i('firebase-admin')
    tb.npm.i('firebase-functions')
    tb.packageJson.addNpmScript(
      'serve',
      'npm run build && firebase emulators:start --only functions'
    )
    tb.packageJson.addNpmScript(
      'shell',
      'npm run build && firebase functions:shell'
    )
    tb.packageJson.addNpmScript('start', 'npm run shell')
    tb.packageJson.addNpmScript(
      'deploy',
      'firebase deploy --only functions'
    )
    tb.packageJson.addNpmScript(
      'logs',
      'firebase functions:log'
    )
    tb.npm.iDev('typescript')
    tb.npm.iDev('@types/node')
    tb.copyAsset('tsconfig.json', tb.destination)
    tb.packageJson.addNpmScript('build', 'tsc')
    tb.packageJson.addNpmScript(
      'build:watch',
      'tsc --watch'
    )
    tb.npm.i('apollo-server-cloud-functions')
    tb.npm.i('graphql')

    tb.npm.i('configuru')
    tb.npm.i('cosmas')
    tb.copyAsset('.env.jsonc', tb.destination)

    tb.npm.iDev('jest')
    tb.npm.iDev('@types/jest')
    tb.npm.iDev('ts-jest')
    tb.npm.iDev('jest-junit')
    tb.copyAsset('jest.config.js', tb.destination)
    tb.packageJson.addNpmScript(
      'test',
      'jest --colors --detectOpenHandles'
    )
    tb.packageJson.addNpmScript(
      'ci-test',
      'npm run test -- --collectCoverage --reporters=default --reporters=jest-junit --ci'
    )
    tb.mkdir(tb.stringToPath(`${tb.destination}/src`))
    tb.mkdir(
      tb.stringToPath(`${tb.destination}/src/test`)
    )
    tb.copyAsset(
      'src/test/helloWorld.test.ts',
      tb.stringToPath(`${tb.destination}/src/test`)
    )

    tb.npm.iDev('@ackee/styleguide-backend-config')
    tb.npm.iDev('prettier')
    // TODO: pinned version due to https://github.com/eslint/eslint/issues/15149
    tb.npm.iDev('eslint@7.32.0')
    tb.copyAsset('.eslint.tsconfig.json', tb.destination)
    tb.copyAsset('.eslintrc.js', tb.destination)
    tb.copyAsset('prettier.config.js', tb.destination)
    tb.packageJson.addNpmScript(
      'prettier',
      "prettier --check --write '**/*.{ts,js,json,md}'"
    )
    tb.packageJson.addNpmScript(
      'lint',
      "eslint '**/*.ts' -f codeframe --fix"
    )
    tb.packageJson.addNpmScript(
      'codestyle',
      'npm run prettier && npm run lint'
    )
    tb.packageJson.addNpmScript(
      'ci-lint',
      'npm run lint -- -f checkstyle -o ./output/checkstyle-result.xml'
    )

    tb.copyAsset(
      'src/config.ts',
      tb.stringToPath(`${tb.destination}/src`)
    )
    tb.copyAsset(
      'src/logger.ts',
      tb.stringToPath(`${tb.destination}/src`)
    )
    tb.copyAsset(
      'src/index.ts',
      tb.stringToPath(`${tb.destination}/src`)
    )

    tb.mkdir(
      tb.stringToPath(`${tb.destination}/src/graphql`)
    )
    tb.copyAsset(
      'src/graphql/index.ts',
      tb.stringToPath(`${tb.destination}/src/graphql`)
    )

    tb.packageJson.runScript('build')
    tb.packageJson.runScript('codestyle')
    tb.packageJson.runScript('ci-lint')
  }
}
