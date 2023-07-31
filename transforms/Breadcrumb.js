const { removeAntdImportAndAddSemiImport } = require('./utils')
module.exports = function transformer(file, api) {
  const j = api.jscodeshift
  const root = j(file.source)

  removeAntdImportAndAddSemiImport(j, root, 'Breadcrumb', 'Breadcrumb')

  // Find the Breadcrumb component usage
  const breadcrumbUsage = root.findJSXElements('Breadcrumb')

  // Add the compact={false} prop to the Breadcrumb component
  breadcrumbUsage.forEach((path) => {
    path.node.openingElement.attributes.push(
      j.jsxAttribute(
        j.jsxIdentifier('compact'),
        j.jsxExpressionContainer(j.booleanLiteral(false))
      )
    )
  })

  return root.toSource()
}
