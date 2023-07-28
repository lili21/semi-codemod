const { removeAntdImportAndAddSemiImport } = require('./utils')
export default function transformer(file, api) {
  const j = api.jscodeshift
  const root = j(file.source)

  removeAntdImportAndAddSemiImport(j, root, 'notification', 'Notification')

  // Transform notification
  root
    .find(j.CallExpression, {
      callee: {
        object: { name: 'notification' }
      }
    })
    .forEach((path) => {
      path.value.arguments.forEach((arg) => {
        arg.properties.forEach((property) => {
          if (property.key.name === 'message') {
            property.key.name = 'content'
            /**
             * 处理参数简写的情况
             * const message = 'hello'
             * notification.error({ message })
             */
            property.shorthand = false
          }

          if (property.key.name === 'placement') {
            property.key.name = 'position'
            property.shorthand = false
          }
        })
      })
      path.value.callee.object.name = 'Notification'
    })

  return root.toSource()
}
