import Starter from '../Starter'
import * as path from 'path'
import Framework from '../Framework'

export default class CloudFunctionsStarter implements Starter {
  public readonly name = 'cloudfunctions'
  protected log = (_message: string) => {}
  install(param: {
    destination: Path
    npm: Npm
    packageJson: PackageJson
    framework: Framework
    asset: (path: Path) => Path
  }) {
    this.log = param.framework.printLn
    param.framework.updatePackageJson(param.packageJson, {
      main: 'lib/index.js',
      engines: {
        node: '16',
      },
    })
    copyAsset('.dockerignore', param.destination)
    copyAsset('.gitignore', param.destination)
    copyAsset('.nvmrc', param.destination)
    copyAsset('Dockerfile', param.destination)
    copyAsset('firebase.json', param.destination)

    param.framework.npmi(param.npm, 'firebase-admin')
    param.framework.npmi(param.npm, 'firebase-functions')
    param.framework.addNpmScript(
      param.packageJson,
      'serve',
      'npm run build && firebase emulators:start --only functions'
    )
    param.framework.addNpmScript(
      param.packageJson,
      'shell',
      'npm run build && firebase functions:shell'
    )
    param.framework.addNpmScript(param.packageJson, 'start', 'npm run shell')
    param.framework.addNpmScript(
      param.packageJson,
      'deploy',
      'firebase deploy --only functions'
    )
    param.framework.addNpmScript(
      param.packageJson,
      'logs',
      'firebase functions:log'
    )
    param.framework.npmiDev(param.npm, 'typescript')
    param.framework.npmiDev(param.npm, '@types/node')
    copyAsset('tsconfig.json', param.destination)
    param.framework.addNpmScript(param.packageJson, 'build', 'tsc')
    param.framework.addNpmScript(
      param.packageJson,
      'build:watch',
      'tsc --watch'
    )
    param.framework.npmi(param.npm, 'apollo-server-cloud-functions')
    param.framework.npmi(param.npm, 'graphql')

    param.framework.npmi(param.npm, 'configuru')
    param.framework.npmi(param.npm, 'cosmas')
    copyAsset('.env.jsonc', param.destination)

    param.framework.npmiDev(param.npm, 'jest')
    param.framework.npmiDev(param.npm, '@types/jest')
    param.framework.npmiDev(param.npm, 'ts-jest')
    param.framework.npmiDev(param.npm, 'jest-junit')
    copyAsset('jest.config.js', param.destination)
    param.framework.addNpmScript(
      param.packageJson,
      'test',
      'jest --colors --detectOpenHandles'
    )
    param.framework.addNpmScript(
      param.packageJson,
      'ci-test',
      'npm run test -- --collectCoverage --reporters=default --reporters=jest-junit --ci'
    )
    param.framework.mkdir(path.normalize(`${param.destination}/src`) as Path)
    param.framework.mkdir(
      path.normalize(`${param.destination}/src/test`) as Path
    )
    copyAsset(
      'src/test/helloWorld.test.ts',
      path.normalize(`${param.destination}/src/test`) as Path
    )

    param.framework.npmiDev(param.npm, '@ackee/styleguide-backend-config')
    param.framework.npmiDev(param.npm, 'prettier')
    // TODO: pinned version due to https://github.com/eslint/eslint/issues/15149
    param.framework.npmiDev(param.npm, 'eslint@7.32.0')
    copyAsset('.eslint.tsconfig.json', param.destination)
    copyAsset('.eslintrc.js', param.destination)
    copyAsset('prettier.config.js', param.destination)
    param.framework.addNpmScript(
      param.packageJson,
      'prettier',
      "prettier --check --write '**/*.{ts,js,json,md}'"
    )
    param.framework.addNpmScript(
      param.packageJson,
      'lint',
      "eslint '**/*.ts' -f codeframe --fix"
    )
    param.framework.addNpmScript(
      param.packageJson,
      'codestyle',
      'npm run prettier && npm run lint'
    )
    param.framework.addNpmScript(
      param.packageJson,
      'ci-lint',
      'npm run lint -- -f checkstyle -o ./output/checkstyle-result.xml'
    )

    copyAsset(
      'src/config.ts',
      path.normalize(`${param.destination}/src`) as Path
    )
    copyAsset(
      'src/logger.ts',
      path.normalize(`${param.destination}/src`) as Path
    )
    copyAsset(
      'src/index.ts',
      path.normalize(`${param.destination}/src`) as Path
    )

    param.framework.mkdir(
      path.normalize(`${param.destination}/src/graphql`) as Path
    )
    copyAsset(
      'src/graphql/index.ts',
      path.normalize(`${param.destination}/src/graphql`) as Path
    )

    param.packageJson.runScript('build')
    param.packageJson.runScript('codestyle')
    param.packageJson.runScript('ci-lint')

    function copyAsset(name: string, destination: Path) {
      param.framework.cpFile(
        param.asset(path.normalize(name) as Path),
        destination
      )
    }
  }
}
