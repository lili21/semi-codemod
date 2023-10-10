const chalk = require('chalk')

const { removeAntdImportAndAddSemiImport } = require('./utils')
module.exports = function transformer(file, api) {
  const j = api.jscodeshift
  const root = j(file.source)

  removeAntdImportAndAddSemiImport(j, root, 'Upload', 'Upload')

  // todo - 暂时没想好怎么自动处理 customRequest 的差异
  console.log(
    chalk.yellow(`
    Upload组件 customRequest函数的参数有差异，如果有用到，记得手动更改一下
    Antd
    ----
    <Upload customRequest={({ file } => {})} />

    Semi
    ----
    <Upload customRequest={({ fileInstance: file }) => {}} />

    Semi中fileInstance参数和Antd中的file等价
  `)
  )

  // Find the Upload component and update its props
  root.findJSXElements('Upload').forEach((path) => {
    const { openingElement } = path.value

    const actionAttribute = openingElement.attributes.find(
      (attr) => attr.name.name === 'action'
    )
    // Semi组件<Upload /> action是必须
    if (!actionAttribute) {
      openingElement.attributes.push(
        j.jsxAttribute(j.jsxIdentifier('action'), j.literal(''))
      )
    }
  })

  return root.toSource()
}
