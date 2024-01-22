const { removeAntdImportAndAddSemiImport } = require('./utils')

const attributeMappings = {
  extra: 'headerExtraContent',
  headStyle: 'headerStyle'
}
const propertiesToRemove = [
  'hoverable',
  'defaultActiveTabKey',
  'activeTabKey',
  'size',
  'tabBarExtraContent',
  'tabList',
  'tabProps',
  'type',
  'onTabChange'
]

export default function transformer(file, api) {
  const j = api.jscodeshift
  const root = j(file.source)

  removeAntdImportAndAddSemiImport(j, root, 'Card', 'Card')

  // Find all JSXElements with the name "Card"
  root.findJSXElements('Card').forEach((path) => {
    const { openingElement } = path.value

    path.node.openingElement.attributes.forEach((attr) => {
      if (Object.keys(attributeMappings).includes(attr.name.name)) {
        attr.name.name = attributeMappings[attr.name.name]
      }
    })

    propertiesToRemove.forEach((propertyName) => {
      j(openingElement)
        .find(j.JSXAttribute, {
          name: {
            name: propertyName
          }
        })
        .remove()
    })
  })

  return root.toSource()
}
