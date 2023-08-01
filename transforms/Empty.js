const { removeAntdImportAndAddSemiImport } = require('./utils')

module.exports = function (file, api) {
  const j = api.jscodeshift
  const root = j(file.source)

  removeAntdImportAndAddSemiImport(j, root, 'Empty', 'Empty')

  // Find all JSXElements with the name "Empty"
  const emptyElements = root.findJSXElements('Empty')

  // Modify each Empty element
  emptyElements.forEach((element) => {
    const { openingElement } = element.node

    const descriptionAttribute = openingElement.attributes.find(
      (attr) => attr.name.name === 'description'
    )

    if (!descriptionAttribute) {
      // Add the "description" attribute with the value "暂无数据"
      element.node.openingElement.attributes.push(
        j.jsxAttribute(j.jsxIdentifier('description'), j.literal('暂无数据'))
      )
    }
  })

  return root.toSource()
}
