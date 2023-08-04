const { removeAntdImportAndAddSemiImport } = require('./utils')

module.exports = function (file, api) {
  const j = api.jscodeshift
  const root = j(file.source)

  removeAntdImportAndAddSemiImport(j, root, 'Select', 'Select')

  // Find all Select JSXElements
  const selectElements = root.findJSXElements('Select')

  selectElements.forEach((element) => {
    const { openingElement } = element.node

    // options -> optionList
    const optionsAttribute = openingElement.attributes.find(
      (attr) => attr.name.name === 'options'
    )
    if (optionsAttribute) {
      optionsAttribute.name.name = 'optionList'
    }

    // mode="multiple" -> multiple
    const modeAttribute = openingElement.attributes.find(
      (attr) => attr.name.name === 'mode' && attr.value.value === 'multiple'
    )
    if (modeAttribute) {
      openingElement.attributes = openingElement.attributes.filter(
        (attr) => attr !== modeAttribute
      )
      openingElement.attributes.push(
        j.jsxAttribute(j.jsxIdentifier('multiple'))
      )
    }

    // showSearch -> filter
    const showSearchAttribute = openingElement.attributes.find(
      (attr) => attr.name.name === 'showSearch'
    )
    if (showSearchAttribute) {
      showSearchAttribute.name.name = 'filter'
    }

    // filterOption处理
    const filterOptionAttribute = openingElement.attributes.find(
      (attr) => attr.name.name === 'filterOption'
    )
    if (filterOptionAttribute) {
      openingElement.attributes = openingElement.attributes.filter(
        (attr) => attr !== filterOptionAttribute
      )
      if (filterOptionAttribute.value.expression.value === false) {
        openingElement.attributes.push(
          j.jsxAttribute(j.jsxIdentifier('remote'))
        )
      } else {
        showSearchAttribute.value = filterOptionAttribute.value
      }
    }

    // notFoundContent -> emptyContent
    const notFoundContentAttribute = openingElement.attributes.find(
      (attr) => attr.name.name === 'notFoundContent'
    )
    if (notFoundContentAttribute) {
      notFoundContentAttribute.name.name = 'emptyContent'
    }
  })

  return root.toSource()
}
