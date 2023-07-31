const { removeAntdImportAndAddSemiImport } = require('./utils')
module.exports = function transformer(file, api) {
  const j = api.jscodeshift
  const root = j(file.source)

  removeAntdImportAndAddSemiImport(j, root, 'Tabs', 'Tabs')

  // add TabPane import
  root
    .find(j.ImportDeclaration, {
      source: {
        value: '@douyinfe/semi-ui'
      }
    })
    .get('specifiers')
    .push(j.importSpecifier(j.identifier('TabPane')))

  // 处理 const TabPane = Tabs.TabPane
  root.findVariableDeclarators('TabPane').remove()

  // 处理 const { TabPane } = Tabs
  root
    .find(j.VariableDeclaration)
    .filter((p) => {
      const declarator = p.node.declarations[0]
      return (
        declarator &&
        declarator.id.type === 'ObjectPattern' &&
        declarator.id.properties.some((prop) => prop.key.name === 'TabPane')
      )
    })
    .remove()

  // Find all TabPane elements and replace the key with itemKey
  root.findJSXElements('TabPane').forEach((path) => {
    const { node } = path
    const tabKeyAttribute = node.openingElement.attributes.find(
      (attr) => attr.name.name === 'key'
    )
    if (tabKeyAttribute) {
      tabKeyAttribute.name.name = 'itemKey'
    }
  })

  // Find all Tabs.TabPane elements
  const tabPanes = root.find(j.JSXElement, {
    openingElement: {
      name: {
        object: { name: 'Tabs' },
        property: { name: 'TabPane' }
      }
    }
  })
  tabPanes.forEach((path) => {
    const { node } = path
    const tabKeyAttribute = node.openingElement.attributes.find(
      (attr) => attr.name.name === 'key'
    )
    if (tabKeyAttribute) {
      tabKeyAttribute.name.name = 'itemKey'
    }
    node.openingElement.name = 'TabPane'
    node.closingElement.name = 'TabPane'
  })

  return root.toSource()
}
