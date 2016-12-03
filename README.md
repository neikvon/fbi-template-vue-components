# vue 组件库模版

## 特性
- 一套组件，同时支持浏览器端和node直出
- 使用css Module，强化样式作用域

## 目录说明
```bash
|-  components          # 组件库
|-    comp1             # 组件
|-      index.js
|-      style.css
|-      template.html
|-  ...
```

### 组件结构
```js
// 样式引入
import './style.css'

// 模版引入
import template from './template.html'

import Vue from 'vue'

export default Vue.extend({

  // 模版声明
  template,

  // 组件对外属性
  props: {
    data: null
  }

  // 其他组件交互
  ...
})
```

## 构建
> 在浏览器端使用时，无需编译，直接 require('comp1') 即可，comp1为组件目录名称
>
> 在node里用vue做直出时，需要先编译，再 require('comp1/dst')，comp1为组件目录名称

```bash
$ fbi b
```

## TODO
1. lerna