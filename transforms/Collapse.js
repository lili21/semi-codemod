const { removeAntdImportAndAddSemiImport } = require('./utils')
module.exports = function transformer(file, api) {
  const j = api.jscodeshift
  const root = j(file.source)

  removeAntdImportAndAddSemiImport(j, root, 'Collapse', 'Collapse')

  // Find all Panel elements and replace the key with itemKey
  root.findJSXElements('Panel').forEach((path) => {
    const {
      node: { openingElement }
    } = path
    const keyAttribute = openingElement.attributes.find(
      (attr) => attr.name.name === 'key'
    )
    if (keyAttribute) {
      keyAttribute.name.name = 'itemKey'
    }

    // Find the collapsible attribute
    const collapsibleAttribute = openingElement.attributes.find(
      (attr) =>
        attr.name.name === 'collapsible' && attr.value.value === 'disabled'
    )

    if (collapsibleAttribute) {
      // Remove the collapsible attribute
      openingElement.attributes = openingElement.attributes.filter(
        (attr) => attr !== collapsibleAttribute
      )

      // Add the disabled attribute with value set to true
      openingElement.attributes.push(
        j.jsxAttribute(j.jsxIdentifier('disabled'))
      )
    }
  })

  // Find all Collapse.Panel elements
  const collapsePanels = root.find(j.JSXElement, {
    openingElement: {
      name: {
        object: { name: 'Collapse' },
        property: { name: 'Panel' }
      }
    }
  })
  collapsePanels.forEach((path) => {
    const {
      node: { openingElement }
    } = path
    const keyAttribute = openingElement.attributes.find(
      (attr) => attr.name.name === 'key'
    )
    if (keyAttribute) {
      keyAttribute.name.name = 'itemKey'
    }

    // Find the collapsible attribute
    const collapsibleAttribute = openingElement.attributes.find(
      (attr) =>
        attr.name.name === 'collapsible' && attr.value.value === 'disabled'
    )

    if (collapsibleAttribute) {
      // Remove the collapsible attribute
      openingElement.attributes = openingElement.attributes.filter(
        (attr) => attr !== collapsibleAttribute
      )

      // Add the disabled attribute with value set to true
      openingElement.attributes.push(
        j.jsxAttribute(j.jsxIdentifier('disabled'))
      )
    }
  })

  return root.toSource()
}
