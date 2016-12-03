module.exports = require => {

  var buble = require('buble')
  var rollupPluginutils = require('rollup-pluginutils')

  return function buble$1(opts) {
    if (!opts) opts = {}
    var filter = rollupPluginutils.createFilter(opts.include, opts.exclude)

    if (!opts.transforms) opts.transforms = {}
    opts.transforms.modules = false

    return {
      name: 'buble',

      transform: function (code, id) {
        if (!filter(id)) return null

        const ret = buble.transform(code, opts)
        return ret
      }
    }
  }
}
