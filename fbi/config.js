module.exports = {
  template: 'vue-components',
  templateDescription: 'vue component tempalte.',
  server: {
    root: 'dst/',
    host: 'localhost',
    port: 8888
  },
  npm: {
    alias: 'npm',
    options: '' // --registry=https://registry.npm.taobao.org'
  },
  alias: {
    b: 'build',
    s: 'serve'
  },
  // 是否开启css module
  cssModules: true,
  // 是否保留css module映射文件 (为true时，会在组件的dst目录生成style.json文件)
  cssMap: true
}
