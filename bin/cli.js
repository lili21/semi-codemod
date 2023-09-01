const meow = require('meow')
const inquirer = require('inquirer')
const globby = require('globby')
const { runTransform, getTransformerChoices } = require('./transformer')

function expandFilePathsIfNeeded(filesBeforeExpansion) {
  const shouldExpandFiles = filesBeforeExpansion.some((file) =>
    file.includes('*')
  )
  return shouldExpandFiles
    ? globby.sync(filesBeforeExpansion)
    : filesBeforeExpansion
}

module.exports.run = async () => {
  const cli = meow({
    description: 'Codemods for migrating Antd@4.x to Semi',
    help: `
    Usage
      $ npx semi-codemod <path> <...options>
        transform   The Component you want to migrate
        path        Files or directory to transform
    Options
      --dry       Dry run (no changes are make to files)
      --print     Print transformed files to you terminal
    `,
    flags: {
      boolean: ['dry', 'print', 'help'],
      string: ['_'],
      alias: {
        h: 'help'
      }
    }
  })

  const { files } = await inquirer.prompt([
    {
      type: 'input',
      name: 'files',
      message: 'On which files or directory should the codemods be applied?',
      when: !cli.input[0],
      default: '.',
      // validate: () =>
      filter: (files) => files.trim()
    }
  ])
  const filesBeforeExpansion = cli.input[0] || files
  const filesExpanded = expandFilePathsIfNeeded([filesBeforeExpansion])

  const transformerChoices = await getTransformerChoices(filesExpanded)
  const { transformers } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'transformers',
      message: 'Which transform would you like to apply?',
      pageSize: transformerChoices.length,
      choices: transformerChoices
    }
  ])

  if (!filesExpanded.length) {
    console.log(`No files found matching ${filesBeforeExpansion.join(' ')}`)
    return null
  }

  if (transformers.length) {
    transformers.forEach((transformer) => {
      runTransform({
        files: filesExpanded,
        flags: cli.flags,
        transformer: transformer
      })
    })
  }
}
