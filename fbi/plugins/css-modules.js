module.exports = (require) => {

  const fs = require('fs')
  const parseAttrs = require('posthtml-attrs-parser')
  const path = require('path')

  let cssModulesCache = {}

  return function (cssModulesPath) {
    return function cssModules (tree) {
      cssModulesCache = {}
      tree.match({
        attrs: {
          'class': /\w+/
        }
      }, node => {
        try {
          const attrs = parseAttrs(node.attrs)
          const cssModuleName = attrs['class']
          attrs.class = []
          if (cssModuleName.length > 1) {
            cssModuleName.map(item => {
              attrs.class.push(getCssClassName(cssModulesPath, item))
            })
          } else {
            attrs.class.push(getCssClassName(cssModulesPath, cssModuleName[0]))
          }
          node.attrs = attrs.compose()

          return node
        } catch (err) {
          console.log(err)
        }
      })
    }
  }

  function getCssClassName (cssModulesPath, cssModuleName) {
    try {
      const cssModules = getCssModules(cssModulesPath)
      const cssClassName = cssModules[cssModuleName]
      if (!cssClassName) {
        throw getError('CSS module "' + cssModuleName + '" is not found')
      } else if (typeof cssClassName !== 'string') {
        throw getError('CSS module "' + cssModuleName + '" is not a string')
      }
      return cssClassName
    } catch (e) {
      return cssModuleName
    }
  }

  function getCssModules (cssModulesPath) {
    try {
      let fullPath = cssModulesPath
      if (!cssModulesCache[fullPath]) {
        cssModulesCache[fullPath] = require(fullPath)
      }

      return cssModulesCache[fullPath]
    } catch (err) {
      throw getError(err)
    }
  }

  function getError (message) {
    const fullMessage = '[plugin: css-modules] ' + message
    return new Error(fullMessage)
  }
}
