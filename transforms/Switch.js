const { removeAntdImportAndAddSemiImport } = require('./utils')

const attributeMappings = {
  checkedChildren: 'checkedText',
  unCheckedChildren: 'uncheckedText'
}

module.exports = function transformer(file, api) {
  const j = api.jscodeshift
  const root = j(file.source)

  removeAntdImportAndAddSemiImport(j, root, 'Switch', 'Switch')

  // Find all JSXElements with the name "Switch"
  root.findJSXElements('Switch').forEach((path) => {
    path.node.openingElement.attributes.forEach((attr) => {
      if (Object.keys(attributeMappings).includes(attr.name.name)) {
        attr.name.name = attributeMappings[attr.name.name]
      }
    })
  })

  return root.toSource()
}
