const { removeAntdImportAndAddSemiImport } = require('./utils')

export default function transformer(file, api) {
  const j = api.jscodeshift
  const root = j(file.source)

  removeAntdImportAndAddSemiImport(j, root, 'Alert', 'Banner')

  // Find all JSXElements with the name "Alert"
  root.findJSXElements('Alert').forEach((path) => {
    const { openingElement } = path.value

    // Find the "message" attribute and replace it with "position"
    const messageAttribute = openingElement.attributes.find(
      (attr) => attr.name.name === 'message'
    )
    if (messageAttribute) {
      messageAttribute.name.name = 'title'
    }

    // 当type的值为"error",替换为"danger"
    const typeAttribute = openingElement.attributes.find(
      (attr) => attr.name.name === 'type'
    )
    if (typeAttribute && typeAttribute.value.value === 'error') {
      typeAttribute.value.value = 'danger'
    }
    // 删除Alert多余的属性
    const propertiesToRemove = [
      'afterClose',
      'banner',
      'closable',
      'closeText',
      'showIcon',
      'closeIcon'
    ]
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
