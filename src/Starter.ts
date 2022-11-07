import Framework from './Framework'

export default interface Starter {
  readonly name: string
  install(param: {
    destination: Path
    framework: Framework
    npm: Npm
    packageJson: PackageJson
    asset: (path: Path) => Path
  }): void
}
