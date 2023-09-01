const execa = require('execa')
const path = require('path')
const swc = require('@swc/core')

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
  args.push('--parser=tsx')

  args = args.concat(['--transform', transformerPath])

  args = args.concat(files)

  console.log(`Executing command: jscodeshift ${args.join(' ')}`)

  const result = execa.sync(jscodeshiftExecutable, args, {
    stdio: 'inherit',
    stripFinalNewline: false
  })

  if (result.failed) {
    throw new Error(`jscodeshift exited with code ${result.exitCode}`)
  }
}

const TRANSFORMER_INQUIRER_CHOICES = [
  'Divider',
  'Breadcrumb',
  'Notification',
  'Table',
  'Tabs',
  'Message',
  'Tooltip',
  'Modal',
  'Drawer',
  'Spin',
  'Empty',
  'Slider',
  'Popover',
  'Col',
  'Row',
  'Tag',
  'Timeline',
  'Collapse',
  'Select'
]
  .sort((a, b) => a.localeCompare(b))
  .map((v) => ({
    name: v,
    value: v
  }))

async function getTransformerChoices(files) {
  console.log(files)
  const components = (
    await Promise.all(
      files.map(async (file) => {
        try {
          const result = await swc.parseFile(file, {
            jsx: true,
            tsx: true
          })
          const importDeclaration = result.body.find(
            (node) =>
              node.type === 'ImportDeclaration' && node.source.value === 'antd'
          )

          return importDeclaration.specifiers
            .filter((specifier) => specifier.local.value !== 'default')
            .map((specifier) => {
              const value = specifier.local.value
              return value.charAt(0).toUpperCase() + value.slice(1)
            })
        } catch (e) {
          console.error(e)
          return []
        }
      })
    )
  ).flat()

  return TRANSFORMER_INQUIRER_CHOICES.filter(({ name }) =>
    components.includes(name)
  )
}

module.exports = {
  runTransform,
  TRANSFORMER_INQUIRER_CHOICES,
  getTransformerChoices
}
