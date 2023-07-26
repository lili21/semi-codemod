// import meow from 'meow'
// import { execa } from 'execa'
// import inquirer from 'inquirer'
// import { globby } from 'globby'
// import path from 'path'
const meow = require('meow')
const execa = require('execa')
const inquirer = require('inquirer')
const globby = require('globby')
const path = require('path')

const jscodeshiftExecutable = require.resolve('.bin/jscodeshift')
const transformerDirectory = path.join(__dirname, '../', 'transforms')

function runTransform({ files, flags, transformer }) {
  const transformerPath = path.join(transformerDirectory, `${transformer}.js`)

  let args = []

  const { dry, print } = flags

  if (dry) {
    args.push('--dry')
  }
  if (print) {
    args.push('--print')
  }

  args.push('--verbose=2')

  args.push('--ignore-pattern=**/node_modules/**')
  args.push('--ignore-pattern=**/dist/**')

  args.push('--extensions=tsx,ts,jsx,js')

  args = args.concat(['--transform', transformerPath])

  args = args.concat(files)

  console.log(`Executing command: jscodeshift ${args.join(' ')}`)

  const result = execa.sync(jscodeshiftExecutable, args, {
    stdio: 'inherit',
    stripFinalNewline: false,
  })

  if (result.failed) {
    throw new Error(`jscodeshift exited with code ${result.exitCode}`)
  }
}

const TRANSFORMER_INQUIRER_CHOICES = [
  {
    name: 'Divider',
    value: 'Divider',
  },
  {
    name: 'Breadcrumb',
    value: 'Breadcrumb'
  }
]

function expandFilePathsIfNeeded(filesBeforeExpansion) {
  const shouldExpandFiles = filesBeforeExpansion.some((file) =>
    file.includes('*')
  )
  return shouldExpandFiles
    ? globby.sync(filesBeforeExpansion)
    : filesBeforeExpansion
}

module.exports.run = () => {
  const cli = meow({
    description: 'Codemods for migrating Antd@4.x to Semi',
    help: `
    Usage
      $ npx semi-codemod <path> <transform> <...options>
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
        h: 'help',
      },
    },
  })

  if (
    cli.input[1] &&
    !TRANSFORMER_INQUIRER_CHOICES.find((x) => x.value === cli.input[1])
  ) {
    console.error('Invalid transform choice, pick one of:')
    console.error(
      TRANSFORMER_INQUIRER_CHOICES.map((x) => '- ' + x.value).join('\n')
    )
    process.exit(1)
  }

  inquirer
    .prompt([
      {
        type: 'input',
        name: 'files',
        message: 'On which files or directory should the codemods be applied?',
        when: !cli.input[0],
        default: '.',
        // validate: () =>
        filter: (files) => files.trim(),
      },
      {
        type: 'list',
        name: 'transformer',
        message: 'Which transform would you like to apply?',
        when: !cli.input[1],
        pageSize: TRANSFORMER_INQUIRER_CHOICES.length,
        choices: TRANSFORMER_INQUIRER_CHOICES,
      },
    ])
    .then((answers) => {
      const { files, transformer } = answers

      const filesBeforeExpansion = cli.input[0] || files
      const filesExpanded = expandFilePathsIfNeeded([filesBeforeExpansion])

      const selectedTransformer = cli.input[1] || transformer

      if (!filesExpanded.length) {
        console.log(`No files found matching ${filesBeforeExpansion.join(' ')}`)
        return null
      }

      return runTransform({
        files: filesExpanded,
        flags: cli.flags,
        transformer: selectedTransformer,
      })
    })
}
