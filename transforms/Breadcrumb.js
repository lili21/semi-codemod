export default function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  // Find the import declaration for antd
  const antdImportDeclaration = root.find(j.ImportDeclaration, {
    source: {
      value: 'antd'
    }
  });

  // Find the named import specifiers
  const namedSpecifiers = antdImportDeclaration.find(j.ImportSpecifier)

  // Find the import specifier for Breadcrumb
  const breadcrumbSpecifier = antdImportDeclaration.find(j.ImportSpecifier, {
    imported: {
      name: 'Breadcrumb'
    }
  });

  // Remove the Breadcrumb import specifier
  breadcrumbSpecifier.remove();

  // Remove the antd import
  if (breadcrumbSpecifier.length && namedSpecifiers.length === 1) {
    antdImportDeclaration.remove()
  }

  // Find the import declaration for semi-ui
  const semiUiImportDeclaration = root.find(j.ImportDeclaration, {
    source: {
      value: '@douyinfe/semi-ui',
    },
  })

  if (semiUiImportDeclaration.length) {
    // Add the Breadcrumb import specifier to semi-ui
    if (
      !semiUiImportDeclaration.find(j.ImportSpecifier, {
        imported: {
          name: 'Breadcrumb',
        },
      }).length
    ) {
      semiUiImportDeclaration
        .get('specifiers')
        .push(j.importSpecifier(j.identifier('Breadcrumb')))
    }
  } else {
    // Add the Breadcrumb import specifier from semi-ui
    antdImportDeclaration.insertAfter(
      j.importDeclaration(
        [j.importSpecifier(j.identifier('Breadcrumb'))],
        j.literal('@douyinfe/semi-ui')
      )
    )
  }

  // Find the Breadcrumb component usage
  const breadcrumbUsage = root.findJSXElements('Breadcrumb');

  // Add the compact={false} prop to the Breadcrumb component
  breadcrumbUsage.forEach((path) => {
    path.node.openingElement.attributes.push(
      j.jsxAttribute(
        j.jsxIdentifier('compact'),
        j.jsxExpressionContainer(j.booleanLiteral(false))
      )
    );
  });

  return root.toSource();
}
