const { removeAntdImportAndAddSemiImport } = require('./utils')
module.exports = function transformer(file, api) {
  const j = api.jscodeshift
  const root = j(file.source)

  removeAntdImportAndAddSemiImport(j, root, 'Table', 'Table')

  // Find the Table component with the pagination prop
  root.findJSXElements('Table').forEach((element) => {
    root.findJSXElements('Table').forEach((path) => {
      const paginationAttribute = path.node.openingElement.attributes.find(
        (attribute) => attribute.name.name === 'pagination'
      )
      if (
        paginationAttribute &&
        paginationAttribute.value.type === 'JSXExpressionContainer'
      ) {
        const paginationValue = paginationAttribute.value.expression
        if (paginationValue.type === 'ObjectExpression') {
          // 处理pagination属性为值的情况
          paginationValue.properties.forEach((property) => {
            if (property.key.name === 'current') {
              property.key.name = 'currentPage'
            }
            if (property.key.name === 'showTotal') {
              property.key.name = 'showTotal'
              property.value = j.booleanLiteral(true)
            }
          })
        } else if (paginationValue.type === 'Identifier') {
          // 处理pagination属性为变量的情况
          // Find all variable declarations with the target variable name
          const variableDeclarations = root.find(j.VariableDeclarator, {
            id: {
              name: paginationValue.name
            }
          })

          // Process each variable declaration
          variableDeclarations.forEach((variableDeclaration) => {
            // Get the node representing the variable declaration
            const node = variableDeclaration.node

            // Find the property named "current" and change it to "currentPage"
            const r = j(node)
            r.find(j.ObjectProperty, {
              key: {
                name: 'current'
              }
            }).forEach((path) => {
              path.node.key.name = 'currentPage'
            })

            r.find(j.ObjectProperty, {
              key: {
                name: 'showTotal'
              },
              value: {
                type: 'ArrowFunctionExpression'
              }
            }).forEach((path) => {
              path.node.value = j.booleanLiteral(true)
            })
          })
        }
      }
    })
  })

  return root.toSource()
}
