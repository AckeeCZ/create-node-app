'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
class CloudFunctionsStarter {
  constructor() {
    this.name = 'cloudfunctions'
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
    tb.packageJson.mergeWith({
      main: 'lib/index.js',
      engines: {
        node: '20',
      },
    })
    tb.copySharedAsset('.dockerignore')
    tb.copySharedAsset('.gitignore')
    tb.copyAsset('.gitlab-ci.yml')
    tb.copyAsset('.nvmrc')
    tb.copyAsset('Dockerfile')
    tb.copyAsset('firebase.json')
    tb.mkdir(tb.stringToPath(`${tb.destination}/ci-branch-config`))
    tb.copyAsset('ci-branch-config/common.env')
    tb.copyAsset('ci-branch-config/development.env')
    tb.copyAsset('ci-branch-config/stage.env')
    tb.copyAsset('ci-branch-config/master.env')
    tb.npm.i('firebase-admin@11.11.1')
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
    tb.packageJson.addNpmScript('deploy', 'firebase deploy --only functions')
    tb.packageJson.addNpmScript('logs', 'firebase functions:log')
    tb.npm.iDev('typescript')
    tb.npm.iDev('@types/node')
    tb.npm.iDev('ts-node')
    tb.copyAsset('tsconfig.json')
    tb.packageJson.addNpmScript('build', 'tsc')
    // TODO: For Gitlab CI pipeline purpose - preferably refactor pipeline cfg to use `build` only
    tb.packageJson.addNpmScript('build:dev', 'tsc')
    tb.packageJson.addNpmScript('build:watch', 'tsc --watch')
    tb.npm.i('apollo-server-cloud-functions')
    tb.npm.i('graphql')
    tb.npm.i('configuru')
    tb.npm.i('pino')
    tb.npm.iDev('pino-pretty')
    tb.copyAsset('.env.jsonc')
    tb.npm.iDev('mocha')
    tb.npm.iDev('mocha-junit-reporter')
    tb.npm.iDev('@types/mocha')
    tb.copySharedAsset('.mocharc.json', tb.destination)
    tb.packageJson.addNpmScript('test', 'mocha')
    tb.packageJson.addNpmScript(
      'ci-test',
      'npm run test -- --parallel=false -R mocha-junit-reporter -O=mochaFile=./output/test.xml'
    )
    tb.mkdir(tb.stringToPath(`${tb.destination}/src`))
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
    tb.copyAsset('src/config.ts')
    tb.copyAsset('src/logger.ts')
    tb.copyAsset('src/index.ts')
    tb.mkdir(tb.stringToPath(`${tb.destination}/src/graphql`))
    tb.copyAsset('src/graphql/index.ts')
    tb.packageJson.runScript('build')
  }
}
exports.default = CloudFunctionsStarter
//# sourceMappingURL=CloudFunctionsStarter.js.map
