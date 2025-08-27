import glob from 'fast-glob'
import fs from 'node:fs'
import path from 'node:path'
export class StarterLoader {
  constructor() {
    this.starters = new Map()
    this.modules = []
    const configFiles = glob.sync(
      `${StarterLoader.starterPath}/**/node-app.jsonc`
    )
    for (const configFile of configFiles) {
      const config = StarterLoader.validateConfig(
        configFile,
        JSON.parse(fs.readFileSync(configFile, 'utf8'))
      )
      const original = this.starters.get(config.id)
      if (original) {
        throw new Error(
          `Duplicate starter: ${config.name}\n` +
            `> Starter 1: ${original.path}\n` +
            `> Starter 2: ${path.dirname(configFile)}`
        )
      }
      this.starters.set(config.id, {
        name: config.name,
        config,
        path: path.dirname(configFile),
        configPath: configFile,
      })
      const module = this.modules.find(module => module.name === config.module)
      if (module) {
        module.starters.push(config.id)
        continue
      }
      this.modules.push({
        name: config.module,
        starters: [config.id],
      })
    }
    this.modules.sort((a, b) => a.name.localeCompare(b.name))
  }
  getOptions() {
    return this.modules
  }
  getStarter(id) {
    const starter = this.starters.get(id)
    if (!starter) {
      throw new Error(`Starter ${id} not found`)
    }
    return starter
  }
  static validateConfig(path, config) {
    if (!config.module) {
      throw new Error(`Invalid config at ${path}: module key is required`)
    }
    if (!config.name) {
      throw new Error(`Invalid config at ${path}: name key is required`)
    }
    if (!config.id) {
      throw new Error(`Invalid config at ${path}: id key is required`)
    }
    if (!StarterLoader.isValidOptionalStringArray(config.prebuild)) {
      throw new Error(
        `Invalid config at ${path}: "prebuild" must be array of npm script names or empty`
      )
    }
    if (!StarterLoader.isValidOptionalStringArray(config.replace)) {
      throw new Error(
        `Invalid config at ${path}: "replace" must be array of files where strings should be replaced`
      )
    }
    const invalidKeys = Object.keys(config).filter(
      key => !['module', 'name', 'prebuild', 'replace', 'id'].includes(key)
    )
    if (invalidKeys.length > 0) {
      throw new Error(
        `Invalid config at ${path}: Unknown key(s): ${invalidKeys.join(', ')}`
      )
    }
    return config
  }
  static isValidOptionalStringArray(array) {
    return (
      !array ||
      (Array.isArray(array) && array.every(item => typeof item === 'string'))
    )
  }
}
StarterLoader.starterPath = path.normalize(
  path.join(import.meta.dirname, '..', 'starter')
)
//# sourceMappingURL=StarterLoader.js.map
