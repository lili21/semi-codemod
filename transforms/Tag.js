const { removeAntdImportAndAddSemiImport } = require('./utils')
module.exports = function transformer(file, api) {
  const j = api.jscodeshift
  const root = j(file.source)

  removeAntdImportAndAddSemiImport(j, root, 'Tag', 'Tag')

  return root.toSource()
}
