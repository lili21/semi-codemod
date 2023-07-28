module.exports.removeAntdImportAndAddSemiImport = (j, root, antdComponentName, semiCompomentName) => {
  // Find the import declaration for antd
  const antdImportDeclaration = root.find(j.ImportDeclaration, {
    source: {
      value: 'antd'
    }
  })

  // Find the named import specifiers
  const namedSpecifiers = antdImportDeclaration.find(j.ImportSpecifier)

  // Find the import specifier for antdComponent
  const antdComponentSpecifier = antdImportDeclaration.find(j.ImportSpecifier, {
    imported: {
      name: antdComponentName
    }
  })

  // Remove the antdComponent import specifier
  antdComponentSpecifier.remove()

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
          name: semiCompomentName
        }
      }).length
    ) {
      semiUiImportDeclaration
        .get('specifiers')
        .push(j.importSpecifier(j.identifier(semiCompomentName)))
    }
  } else {
    // Add the Notification import specifier from semi-ui
    antdImportDeclaration.insertAfter(
      j.importDeclaration(
        [j.importSpecifier(j.identifier(semiCompomentName))],
        j.literal('@douyinfe/semi-ui')
      )
    )
  }

  // Remove the antd import
  if (antdComponentSpecifier.length && namedSpecifiers.length === 1) {
    antdImportDeclaration.remove()
  }
}
