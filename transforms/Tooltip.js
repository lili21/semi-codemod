const { removeAntdImportAndAddSemiImport } = require('./utils')

export default function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  removeAntdImportAndAddSemiImport(j, root, 'Tooltip', 'Tooltip')

  // Replace title with content
    root.findJSXElements('Tooltip').forEach(path => {
    const titleAttribute = path.node.openingElement.attributes.find(attr => attr.name.name === 'title');
    if (titleAttribute) {
      titleAttribute.name.name = 'content';
    }
  });
  return root.toSource();
}
