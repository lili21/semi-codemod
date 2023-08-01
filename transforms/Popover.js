const { removeAntdImportAndAddSemiImport } = require('./utils')
module.exports = function transformer(file, api) {
  const j = api.jscodeshift
  const root = j(file.source)

  removeAntdImportAndAddSemiImport(j, root, 'Popover', 'Popover')

  // Find all JSXElements with the name "Popover"
  root.findJSXElements('Popover').forEach((path) => {
    const { openingElement } = path.value

    // Find the "placement" attribute and replace it with "position"
    const placementAttribute = openingElement.attributes.find(
      (attr) => attr.name.name === 'placement'
    )
    if (placementAttribute) {
      placementAttribute.name.name = 'position'
    } else {
      // semi的默认position为bottom，antd为top，所以需要默认添加 position="top" 属性
      openingElement.attributes.push(
        j.jsxAttribute(j.jsxIdentifier('position'), j.literal('top'))
      )
    }
  })

  return root.toSource()
}
