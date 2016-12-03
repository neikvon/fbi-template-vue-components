module.exports = require => {

  const { createFilter } = require('rollup-pluginutils')
  const fs = require('fs')
  const path = require('path')
  const postcss = require('postcss')

  function cwd(file) {
    return path.join(process.cwd(), file)
  }

  return function (options = {}) {
    const filter = createFilter(options.include, options.exclude)
    const extensions = options.extensions || ['.css', '.sss']
    const getExport = options.getExport || function () { }
    const outputMappings = {}

    return {
      intro() {
        return ''
      },
      transform(code, id) {
        if (!filter(id)) return null

        if (extensions.indexOf(path.extname(id)) === -1) return null
        const opts = {
          from: options.from ? cwd(options.from) : id,
          to: options.to ? cwd(options.to) : id,
          map: {
            inline: false,
            annotation: false
          },
          parser: options.parser
        }
        return postcss(options.plugins || [])
          .process(code, opts)
          .then(result => {
            outputMappings[id] = result.css
            options.output(result.css)

            return {
              code: `export default ${JSON.stringify(result.css)}`,
              map: result.map
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    }
  }
}