type Path = string & { readonly _tag: 'path' }

interface PackageJson {
  json: () => any
  path: Path
  runScript: (name: string) => void
}

interface Npm {
  run: (args: string[]) => void
  dir?: Path
}
