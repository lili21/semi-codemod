const { removeAntdImportAndAddSemiImport } = require('./utils')
module.exports = function transformer(file, api) {
  const j = api.jscodeshift
  const root = j(file.source)

  removeAntdImportAndAddSemiImport(j, root, 'Divider', 'Divider')

  // Find the JSX element <Divider /> and replace the attirbute
  root.findJSXElements('Divider').forEach((element) => {
    element.node.openingElement.attributes.forEach((attr) => {
      if (attr.name.name === 'type') {
        attr.name.name = 'layout'
      }
      if (attr.name.name === 'orientation') {
        attr.name.name = 'align'
      }
    })
  })

  return root.toSource()
}
