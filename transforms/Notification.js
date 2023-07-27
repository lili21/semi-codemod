export default function transformer(file, api) {
  const j = api.jscodeshift
  const root = j(file.source)

  // Find the import declaration for antd
  const antdImportDeclaration = root.find(j.ImportDeclaration, {
    source: {
      value: 'antd'
    }
  })

  // Find the named import specifiers
  const namedSpecifiers = antdImportDeclaration.find(j.ImportSpecifier)

  // Find the import specifier for Breadcrumb
  const notificationSpecifier = antdImportDeclaration.find(j.ImportSpecifier, {
    imported: {
      name: 'notification'
    }
  })

  // Remove the 'notification' import specifier
  notificationSpecifier.remove()

  // Remove the antd import
  if (notificationSpecifier.length && namedSpecifiers.length === 1) {
    antdImportDeclaration.remove()
  }

  // Find the import declaration for semi-ui
  const semiUiImportDeclaration = root.find(j.ImportDeclaration, {
    source: {
      value: '@douyinfe/semi-ui'
    }
  })

  if (semiUiImportDeclaration.length) {
    // Add the Notification import specifier to semi-ui
    if (
      !semiUiImportDeclaration.find(j.ImportSpecifier, {
        imported: {
          name: 'Notification'
        }
      }).length
    ) {
      semiUiImportDeclaration
        .get('specifiers')
        .push(j.importSpecifier(j.identifier('Notification')))
    }
  } else {
    // Add the Notification import specifier from semi-ui
    antdImportDeclaration.insertAfter(
      j.importDeclaration(
        [j.importSpecifier(j.identifier('Notification'))],
        j.literal('@douyinfe/semi-ui')
      )
    )
  }

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
