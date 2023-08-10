const { removeAntdImportAndAddSemiImport } = require('./utils')

const attributeMappings = {
  getContainer: 'getPopupContainer',
  forceRender: 'keepDom',
  keyboard: 'closeOnEsc',
  open: 'visible'
}

export default function transformer(file, api) {
  const j = api.jscodeshift
  const root = j(file.source)

  removeAntdImportAndAddSemiImport(j, root, 'Modal', 'Modal')

  // 1. Modal.method
  root
    .find(j.CallExpression, {
      callee: {
        object: {
          name: 'Modal'
        }
      }
    })
    .forEach((path) => {
      // Remove some properties
      const propertiesToRemove = [
        'afterClose',
        'autoFocusButton',
        'closeIcon',
        'getContainer',
        'keyboard',
        'wrapClassName'
      ]

      propertiesToRemove.forEach((propertyName) => {
        j(path)
          .find(j.ObjectProperty, {
            key: {
              name: propertyName
            }
          })
          .remove()
      })
    })

  // 2. <Modal></Modal>
  root.findJSXElements('Modal').forEach((path) => {
    // Modify the destroyOnClose prop
    path.node.openingElement.attributes =
      path.node.openingElement.attributes.filter(
        (attr) => attr.name.name !== 'destroyOnClose'
      )

    // Modify the focusTriggerAfterClose prop
    path.node.openingElement.attributes =
      path.node.openingElement.attributes.filter(
        (attr) => attr.name.name !== 'focusTriggerAfterClose'
      )

    path.node.openingElement.attributes.forEach((attr) => {
      if (Object.keys(attributeMappings).includes(attr.name.name)) {
        attr.name.name = attributeMappings[attr.name.name]
      }
    })

    // Set the 'height' attribute to 'fit-content' because the modal will have the same height as the screen if there is not 'height' property in Semi
    let hasHeight = false

    // Check if 'height' attribute already exists
    path.node.openingElement.attributes.forEach((attr) => {
      if (attr.name.name === 'height') {
        hasHeight = true
      }
    })

    // Add 'height' attribute if it doesn't exist
    if (!hasHeight) {
      const newAttribute = j.jsxAttribute(
        j.jsxIdentifier('height'),
        j.stringLiteral('fit-content')
      )
      path.node.openingElement.attributes.push(newAttribute)
    }
  })
  return root.toSource()
}
