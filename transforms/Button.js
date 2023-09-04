const {
  removeAntdImportAndAddSemiImport,
  appendSemiImport
} = require('./utils')
module.exports = function transformer(file, api) {
  const j = api.jscodeshift
  const root = j(file.source)

  removeAntdImportAndAddSemiImport(j, root, 'Button', 'Button')

  appendSemiImport(j, root, 'Typography')

  // 处理 <Button type="link" />
  // Find all JSX elements with the name 'Button' and attribute 'type' set to 'link'
  root
    .find(j.JSXElement, {
      openingElement: {
        name: {
          name: 'Button'
        },
        attributes: (attributes) =>
          attributes.some(
            (attr) =>
              attr.name &&
              attr.name.name === 'type' &&
              attr.value &&
              attr.value.value === 'link'
          )
      }
    })
    .forEach((node) => {
      // Create the new Typography.Text component
      const { openingElement, closingElement } = node.value
      openingElement.name.name = 'Typography.Text'
      closingElement.name.name = 'Typography.Text'

      const targetAttribute = openingElement.attributes.find(
        (attr) => attr.name.name === 'target'
      )
      const hrefAttribute = openingElement.attributes.find(
        (attr) => attr.name.name === 'href'
      )

      // 处理 danger
      const dangerAttr = openingElement.attributes.find(
        (attr) => attr.name.name === 'danger'
      )

      if (targetAttribute && hrefAttribute) {
        // Create an object expression for the 'link' attribute
        const linkObject = j.jsxExpressionContainer(
          j.objectExpression([
            j.objectProperty(
              j.identifier('target'),
              targetAttribute ? targetAttribute.value : null
            ),
            j.objectProperty(
              j.identifier('href'),
              hrefAttribute ? hrefAttribute.value : null
            )
          ])
        )

        openingElement.attributes = [
          j.jsxAttribute(j.jsxIdentifier('link'), linkObject)
        ]
      } else {
        openingElement.attributes = [j.jsxAttribute(j.jsxIdentifier('link'))]
      }

      openingElement.attributes.push(
        j.jsxAttribute(
          j.jsxIdentifier('weight'),
          j.jsxExpressionContainer(j.literal(400))
        )
      )
      if (dangerAttr) {
        openingElement.attributes.push(
          j.jsxAttribute(j.jsxIdentifier('type'), j.literal('danger'))
        )
      }
    })

  // 处理其他Button
  root.findJSXElements('Button').forEach((node) => {
    const { attributes } = node.value.openingElement
    // 默认添加 theme="solid"
    attributes.push(
      j.jsxAttribute(j.jsxIdentifier('theme'), j.literal('solid'))
    )

    // 处理 danger
    const dangerAttr = attributes.find((attr) => attr.name.name === 'danger')

    if (dangerAttr) {
      const typeAttr = attributes.find((attr) => attr.name.name === 'type')
      typeAttr.value.value = 'danger'
      node.value.openingElement.attributes = attributes.filter(
        (attr) => attr !== dangerAttr
      )
    }
  })

  return root.toSource()
}
