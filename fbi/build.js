const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const rollup = require('rollup')
const glob = require('glob')
const precss = require('precss')
const postcssModules = require('postcss-modules')
const buble = require('./plugins/buble')(require)
const postcss = require('./plugins/postcss')(require)
const html = require('./plugins/html')(require)
const root = 'packages/'
function noop () { }

const components = glob.sync(root + '*')
const cssExportMap = {}

components.map(item => {
  // 单个组件
  const componentName = path.basename(item)
  const entries = glob.sync(`${item}/**/*`, {
    dot: true,
    ignore: ['**/dst/**', '**/*/package.json', '.*']
  })
  const folder = `${item}/dst`
  const cssJsonPath = path.resolve(`${folder}/style.json`)
  mkdirp.sync(folder)

  return entries.map(entry => {
    // 组件资源
    const distFile = `${folder}/${entry.split('/').pop()}`

    return rollup.rollup({
      entry: entry,
      plugins: [
        postcss({
          include: root + '**/*.css',
          plugins: [
            precss(),
            ctx.options.cssModules
              ? postcssModules({
                scopeBehaviour: 'local', // can be 'global' or 'local',
                generateScopedName: `${componentName}-[local]--[hash:base64:5]`,
                getJSON(filePath, json) {
                  fs.writeFileSync(cssJsonPath, JSON.stringify(json))
                }
              })
              : noop
          ],
          output(ret) {
            const ext = path.extname(entry)
            if (ext === '.css') {
              fs.writeFileSync(distFile, ret)
              ctx.log(`${distFile} done!`)
            }
          }
        }),
        html({
          cssJsonPath: cssJsonPath,
          include: root + '**/*.html'
        }),
        buble({
          include: root + '**/*.js',
          transforms: {
            arrow: false,
            classes: false,
            defaultParameter: false,
            destructuring: false,
            forOf: false,
            generator: false,
            letConst: false,
            parameterDestructuring: false,
            spreadRest: false,
            templateString: false
          }
        })
      ],
      onwarn: function () {}
    })
      .then(bundle => {
        const ext = path.extname(entry)
        if (ext === '.js') {
          bundle.write({
            format: 'cjs',
            dest: distFile,
            sourceMap: false
          }).then(() => {
            ctx.log(`${distFile} done!`)

            if (!ctx.options.cssMap) {
              fs.unlink(cssJsonPath, err => {
                if (err) {
                  console.log(err)
                }
              })
            }
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
  })
})

/*
buble transforms options:

  arrow
  classes
  collections
  computedProperty
  conciseMethodProperty
  constLoop
  dangerousForOf
  dangerousTaggedTemplateString
  defaultParameter
  destructuring
  forOf
  generator
  letConst
  modules
  numericLiteral
  parameterDestructuring
  reservedProperties
  spreadRest
  stickyRegExp
  templateString
  unicodeRegExp
*/
