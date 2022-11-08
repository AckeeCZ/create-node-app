import * as path from 'path'
import * as fs from 'fs'
import PackageJson from './PackageJson'
import Npm from './Npm'
import logger from './Logger'

export default class Toolbelt {
	public readonly npm: Npm
	public readonly packageJson: PackageJson
	readonly assetDirectory: string
	readonly destination: string
	constructor(params: { npm: Npm, packageJson: PackageJson, assetDirectory: string, destination: string }) {
		this.npm = params.npm
		this.packageJson = params.packageJson
		this.assetDirectory = params.assetDirectory
		this.destination = params.destination
	}
	public stringToPath(str: string) {
		return path.normalize(str) as Path
	}
	public mkdir(
		dirpath: string,
		option?: {
			/** If exists, remove recursively first */
			overwrite?: boolean
		}
	) {
		dirpath = this.stringToPath(dirpath)
		if (fs.existsSync(dirpath) && option?.overwrite) {
			fs.rmSync(dirpath, { recursive: true })
		}
		fs.mkdirSync(dirpath)
	}
	/**
* Like cp, but second argument does not need to include file name
* the name is preserved.
*/
	public cpFile(a: string, b: string) {
		a = this.stringToPath(a)
		b = this.stringToPath(b)
		const file = path.basename(a)
		this.cp(a, this.stringToPath(`${b}/${file}`))
	}

	public cp(a: string, b: string) {
		a = this.stringToPath(a)
		b = this.stringToPath(b)
		logger.info(`> cp ${a} ${b}`)
		fs.copyFileSync(a, b)
	}
	public copyAsset(name: string, destination: string) {
		name = this.stringToPath(name)
		destination = this.stringToPath(destination)
		this.cpFile(
			`${this.assetDirectory}/${name}`,
			destination
		)
	}
}