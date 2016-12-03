module.exports = require => {

  const createFilter = require('rollup-pluginutils').createFilter
  const fs = require('fs')
  const path = require('path')
  const posthtml = require('posthtml')

  return function css(opts = {}) {
    const filter = createFilter(opts.include, opts.exclude)
    opts.output = opts.output || function () { }

    return {
      name: 'html',

      transform(code, id) {
        if (!filter(id)) return

        return posthtml([require('./plugins/css-modules.js')(require)(opts.cssJsonPath)])
          .process(fs.readFileSync(id, 'utf8'))
          .then(result => {
            opts.output(result.html)
            return {
              code: ('export default ' + (JSON.stringify(result.html)) + ';'),
              map: { mappings: '' }
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    }
  }
}