const { removeAntdImportAndAddSemiImport } = require('./utils')

export default function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  removeAntdImportAndAddSemiImport(j, root, 'message', 'Toast')


  // Replace usage of message with Toast
  root
    .find(j.CallExpression, {
      callee: {
        object: {
          name: 'message'
        }
      }
    })
    .replaceWith(nodePath => {
      const { node } = nodePath;
      const { arguments: args } = node;

      if (args.length === 1) {
        const [arg] = args;
        return j.callExpression(
          j.memberExpression(j.identifier('Toast'), j.identifier(node.callee.property.name)),
          [arg]
        );
      }

      return node;
    });

  return root.toSource();
}
