import { Merger } from './Merger.js'
import fsp from 'fs/promises'
import * as ts from 'typescript'
export class ContainerMerger extends Merger {
  async merge(originDir) {
    const content = await this.getWhichExistsOrNull(originDir)
    if (content) {
      return content
    }
    const { originPath, destPath } = this.getPaths(originDir)
    const [originContainer, destContainer] = await Promise.all([
      fsp.readFile(originPath, 'utf8'),
      fsp.readFile(destPath, 'utf8'),
    ])
    const originAst = this.parseFile(originContainer)
    const destAst = this.parseFile(destContainer)
    const mergedImports = this.mergeImports(originAst, destAst)
    const mergedInterface = this.mergeInterface(originAst, destAst)
    const mergedFunction = this.mergeFunction(originAst, destAst)
    return `${mergedImports}\n\n${mergedInterface}\n\nexport type ContainerFactory = () => Promise<Container>\n\n${mergedFunction}\n`
  }
  parseFile(content) {
    return ts.createSourceFile('temp.ts', content, ts.ScriptTarget.Latest, true)
  }
  mergeImports(originAst, destAst) {
    const imports = []
    const addImports = node => {
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
  mergeInterface(originAst, destAst) {
    const properties = []
    const extractProperties = node => {
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
  mergeFunction(originAst, destAst) {
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
  mergeReturnProperties(originProps, destProps) {
    const mergedProps = new Map()
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
  getPropertyName(prop) {
    if (ts.isPropertyAssignment(prop)) {
      if (ts.isIdentifier(prop.name) || ts.isStringLiteral(prop.name)) {
        return prop.name.text
      }
    } else if (ts.isShorthandPropertyAssignment(prop)) {
      return prop.name.text
    }
    return null
  }
  formatNestedObject(propText) {
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
  extractFunctionBody(ast) {
    const content = []
    const returnProps = []
    const visit = node => {
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
  isCreateContainer(node) {
    return (
      ts.isVariableDeclaration(node) &&
      node.name.getText() === 'createContainer'
    )
  }
  isContentStatement(statement) {
    return (
      ts.isVariableStatement(statement) ||
      (ts.isExpressionStatement(statement) &&
        ts.isCallExpression(statement.expression))
    )
  }
  isReturnWithObject(statement) {
    return (
      ts.isReturnStatement(statement) &&
      !!statement.expression &&
      ts.isObjectLiteralExpression(statement.expression)
    )
  }
}
//# sourceMappingURL=ContainerMerger.js.map
