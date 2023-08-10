const { removeAntdImportAndAddSemiImport } = require('./utils')
module.exports = function transformer(file, api) {
  const j = api.jscodeshift
  const root = j(file.source)

  removeAntdImportAndAddSemiImport(j, root, 'Drawer', 'SideSheet')

  // Find all JSXElements with the name "Drawer"
  root
    .find(j.JSXElement, {
      openingElement: {
        name: {
          name: 'Drawer'
        }
      }
    })
    .forEach((path) => {
      const { openingElement, closingElement } = path.value

      // Replace the name "Drawer" with "SideSheet"
      openingElement.name.name = 'SideSheet'
      closingElement.name.name = 'SideSheet'

      // Find the "open" attribute and replace it with "visible"
      const openAttribute = openingElement.attributes.find(
        (attr) => attr.name.name === 'open'
      )
      if (openAttribute) {
        openAttribute.name.name = 'visible'
      }

      // Find the "onClose" attribute and replace it with "onCancel"
      const onCloseAttribute = openingElement.attributes.find(
        (attr) => attr.name.name === 'onClose'
      )
      if (onCloseAttribute) {
        onCloseAttribute.name.name = 'onCancel'
      }
    })

  return root.toSource()
}
