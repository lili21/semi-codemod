const { removeAntdImportAndAddSemiImport } = require('./utils')
module.exports = function transformer(file, api) {
  const j = api.jscodeshift
  const root = j(file.source)

  removeAntdImportAndAddSemiImport(j, root, 'Space', 'Space')

  // Find all JSXElements with the name "Space"
  root.findJSXElements('Space').forEach((path) => {
    const { openingElement } = path.value

    // Find the "direction" attribute and replace it with "vertical"
    const directionAttribute = openingElement.attributes.find(
      (attr) => attr.name.name === 'direction'
    )
    if (directionAttribute) {
      if (directionAttribute.value.value === 'vertical') {
        openingElement.attributes.push(
          j.jsxAttribute(j.jsxIdentifier('vertical'))
        )
      }
      openingElement.attributes = openingElement.attributes.filter(
        (attr) => attr.name.name !== 'direction'
      )
    }
  })

  return root.toSource()
}
