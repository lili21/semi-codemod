module.exports = function transformer(file, api) {
  const j = api.jscodeshift
  const root = j(file.source)

  // Find the import declaration for antd
  const antdImportDeclaration = root.find(j.ImportDeclaration, {
    source: {
      value: 'antd',
    },
  })

  // Find the named import specifiers
  const namedSpecifiers = antdImportDeclaration.find(j.ImportSpecifier)

  // Find the import specifiers for Divider and remove
  const dividerImportDeclaration = antdImportDeclaration.find(
    j.ImportSpecifier,
    {
      imported: {
        name: 'Divider',
      },
    }
  )

  dividerImportDeclaration.remove()

  if (dividerImportDeclaration.length && namedSpecifiers.length === 1) {
    antdImportDeclaration.remove()
  }

  // Find the import declaration for semi-ui
  const semiUiImportDeclaration = root.find(j.ImportDeclaration, {
    source: {
      value: '@douyinfe/semi-ui',
    },
  })

  if (semiUiImportDeclaration.length) {
    // Add the Divider import specifier to semi-ui
    if (
      !semiUiImportDeclaration.find(j.ImportSpecifier, {
        imported: {
          name: 'Divider',
        },
      }).length
    ) {
      semiUiImportDeclaration
        .get('specifiers')
        .push(j.importSpecifier(j.identifier('Divider')))
    }
  } else {
    // Add the Divider import specifier from semi-ui
    antdImportDeclaration.insertAfter(
      j.importDeclaration(
        [j.importSpecifier(j.identifier('Divider'))],
        j.literal('@douyinfe/semi-ui')
      )
    )
  }

  // Find the JSX element <Divider /> and replace the attirbute
  root.findJSXElements('Divider').forEach((element) => {
    element.node.openingElement.attributes.forEach((attr) => {
      if (attr.name.name === 'type') {
        attr.name.name = 'layout'
      }
      if (attr.name.name === 'orientation') {
        attr.name.name = 'align'
      }
    })
  })

  return root.toSource()
}
