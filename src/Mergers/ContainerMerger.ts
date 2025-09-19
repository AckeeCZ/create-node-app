import { Merger } from './Merger.js'
import * as ts from 'typescript'
import { Files } from '../Files.js'

export class ContainerMerger extends Merger {
  async merge(originDir: string): Promise<string> {
    const content = await this.getWhichExistsOrNull(originDir)
    if (content) {
      return content
    }

    const { originPath, destPath } = this.getPaths(originDir)

    const [originContainer, destContainer] = await Promise.all([
      Files.readUtf8File(originPath),
      Files.readUtf8File(destPath),
    ])

    const originAst = this.parseFile(originContainer)
    const destAst = this.parseFile(destContainer)

    const mergedImports = this.mergeImports(originAst, destAst)
    const mergedInterface = this.mergeInterface(originAst, destAst)
    const mergedFunction = this.mergeFunction(originAst, destAst)

    return `${mergedImports}\n\n${mergedInterface}\n\nexport type ContainerFactory = () => Promise<Container>\n\n${mergedFunction}\n`
  }

  protected parseFile(content: string): ts.SourceFile {
    return ts.createSourceFile('temp.ts', content, ts.ScriptTarget.Latest, true)
  }

  protected mergeImports(
    originAst: ts.SourceFile,
    destAst: ts.SourceFile
  ): string {
    const imports: string[] = []

    const addImports = (node: ts.Node) => {
      if (!ts.isImportDeclaration(node)) {
        node.forEachChild(addImports)
        return
      }

      const importText = node.getText()
      if (!imports.includes(importText)) {
        imports.push(importText)
      }

      node.forEachChild(addImports)
    }

    addImports(originAst)
    addImports(destAst)

    return imports.join('\n')
  }

  protected mergeInterface(
    originAst: ts.SourceFile,
    destAst: ts.SourceFile
  ): string {
    const properties: string[] = []

    const extractProperties = (node: ts.Node) => {
      if (!ts.isInterfaceDeclaration(node) || node.name.text !== 'Container') {
        node.forEachChild(extractProperties)
        return
      }

      node.members.forEach(member => {
        if (!ts.isPropertySignature(member)) {
          return
        }

        const propText = member.getText().trim()
        if (!properties.includes(propText)) {
          properties.push(propText)
        }
      })

      node.forEachChild(extractProperties)
    }

    extractProperties(originAst)
    extractProperties(destAst)

    return `export interface Container {\n  ${properties.join('\n  ')}\n}`
  }

  protected mergeFunction(
    originAst: ts.SourceFile,
    destAst: ts.SourceFile
  ): string {
    const originFunctionBody = this.extractFunctionBody(originAst)
    const destFunctionBody = this.extractFunctionBody(destAst)

    const allFunctionContent = [
      ...originFunctionBody.content,
      ...destFunctionBody.content,
    ]

    const mergedReturnProps = this.mergeReturnProperties(
      originFunctionBody.returnProps,
      destFunctionBody.returnProps
    )

    let body = ''
    if (allFunctionContent.length > 0) {
      body += allFunctionContent.join('\n') + '\n\n'
    }

    body += `  return {\n    ${mergedReturnProps.join(',\n    ')}\n  }`

    return `export const createContainer = async (): Promise<Container> => {\n${body}\n}`
  }

  protected mergeReturnProperties(
    originProps: ts.ObjectLiteralElementLike[],
    destProps: ts.ObjectLiteralElementLike[]
  ): string[] {
    const mergedProps = new Map<string, ts.ObjectLiteralElementLike>()

    originProps.forEach(prop => {
      const propName = this.getPropertyName(prop)
      if (propName) {
        mergedProps.set(propName, prop)
      }
    })

    destProps.forEach(prop => {
      const propName = this.getPropertyName(prop)
      if (propName) {
        mergedProps.set(propName, prop)
      }
    })

    return Array.from(mergedProps.values()).map(prop => {
      const propText = prop.getText()
      if (
        ts.isPropertyAssignment(prop) &&
        ts.isObjectLiteralExpression(prop.initializer)
      ) {
        return this.formatNestedObject(propText)
      }
      return propText
    })
  }

  protected getPropertyName(prop: ts.ObjectLiteralElementLike): string | null {
    if (ts.isPropertyAssignment(prop)) {
      if (ts.isIdentifier(prop.name) || ts.isStringLiteral(prop.name)) {
        return prop.name.text
      }
    } else if (ts.isShorthandPropertyAssignment(prop)) {
      return prop.name.text
    }
    return null
  }

  protected formatNestedObject(propText: string): string {
    const lines = propText.split('\n')
    return lines
      .map((line, index) => {
        if (index === 0) {
          return line
        }
        return '    ' + line
      })
      .join('\n')
  }

  protected extractFunctionBody(ast: ts.SourceFile): {
    content: string[]
    returnProps: ts.ObjectLiteralElementLike[]
  } {
    const content: string[] = []
    const returnProps: ts.ObjectLiteralElementLike[] = []

    const visit = (node: ts.Node) => {
      if (!this.isCreateContainer(node)) {
        ts.forEachChild(node, visit)
        return
      }

      if (!node.initializer || !ts.isArrowFunction(node.initializer)) {
        ts.forEachChild(node, visit)
        return
      }

      const body = node.initializer.body
      if (!ts.isBlock(body)) {
        ts.forEachChild(node, visit)
        return
      }

      body.statements.forEach(statement => {
        if (this.isContentStatement(statement)) {
          content.push(statement.getText().trim())
        } else if (this.isReturnWithObject(statement)) {
          // Extract the actual property nodes, not just their names
          statement.expression.properties.forEach(prop => {
            returnProps.push(prop)
          })
        }
      })

      ts.forEachChild(node, visit)
    }

    visit(ast)
    return { content, returnProps }
  }

  protected isCreateContainer(node: ts.Node): node is ts.VariableDeclaration {
    return (
      ts.isVariableDeclaration(node) &&
      node.name.getText() === 'createContainer'
    )
  }

  protected isContentStatement(statement: ts.Statement): boolean {
    return (
      ts.isVariableStatement(statement) ||
      (ts.isExpressionStatement(statement) &&
        ts.isCallExpression(statement.expression))
    )
  }

  protected isReturnWithObject(
    statement: ts.Statement
  ): statement is ts.ReturnStatement & {
    expression: ts.ObjectLiteralExpression
  } {
    return (
      ts.isReturnStatement(statement) &&
      !!statement.expression &&
      ts.isObjectLiteralExpression(statement.expression)
    )
  }
}
