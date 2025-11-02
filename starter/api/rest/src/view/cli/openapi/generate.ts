import { spawn } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import yaml from 'yaml'

export const description = 'Generate OpenAPI types and validate the spec'
export const positional = '<filepath>'

export const run = async (argv: any): Promise<void> => {
  console.log('Generating OpenAPI types and validate the spec...')
  const yamlFilePath = argv.filepath
  const tsFilePath = path.join(
    path.dirname(argv.filepath),
    `${path.basename(argv.filepath, path.extname(argv.filepath))}.ts`
  )

  await new Promise((resolve, reject) => {
    const process = spawn(
      'npx',
      ['openapi-typescript', yamlFilePath, '--output', tsFilePath],
      { stdio: 'inherit' }
    )
    process.on('exit', resolve)
    process.on('error', reject)
  })

  console.log('Generating path mappings...')

  const types = readFileSync(tsFilePath)
  const spec = yaml.parse(readFileSync(yamlFilePath).toString())

  const pathsWithOperationIds = Object.keys(spec.paths).reduce((acc, path) => {
    const pathSpec = spec.paths[path]
    Object.keys(pathSpec).forEach(method => {
      if (pathSpec[method]?.operationId) {
        const operationResponses = pathSpec[method].responses ?? {}
        const successStatus =
          Object.keys(operationResponses).find(status =>
            status.startsWith('2')
          ) ?? '200'

        acc[pathSpec[method].operationId] = {
          method,
          path,
          successStatus: parseInt(successStatus, 10),
        }
      }
    })
    return acc
  }, {} as any)

  const finalSpec =
    `/* eslint-disable sonarjs/no-duplicate-string */\n` +
    `/* eslint-disable sonarjs/use-type-alias */\n` +
    types.toString('utf8').replaceAll('requestBody?:', 'requestBody:') +
    `export const operationPaths = ${JSON.stringify(
      pathsWithOperationIds
    )} as const\n`

  writeFileSync(tsFilePath, finalSpec)

  console.log('Done 🎉')
}

export const options = (yargs: any) => {
  return yargs.positional('filepath', {
    required: true,
    type: 'string',
    description: 'Input OpenAPI specification file',
  })
}
