// import '@babel/polyfill'
import Vue, { DirectiveOptions } from 'vue'

import 'normalize.css'
// import ElementUI from 'element-ui'

// 自定义组件
import '@/components/index'
// 引入 view-ui 组件库
import '@/view-ui'
import 'view-design/dist/styles/iview.css'
import '@/styles/index.less'
import '@/styles/theme.less'

import SvgIcon from 'vue-svgicon'

import App from '@/App.vue'
import store from '@/store'
import router from '@/router'
import '@/icons/components'
import '@/permission'
import '@/utils/error-log'
import * as directives from '@/directives'
import * as filters from '@/filters'
import { checkPermission } from './utils/permission'
import Cookies from 'js-cookie'
Vue.prototype.$cookies = window.Cookies = Cookies

Vue.use(SvgIcon, {
  tagName: 'svg-icon',
  defaultWidth: '1.2em',
  defaultHeight: '1.2em'
})

// Register global directives
Object.keys(directives).forEach(key => {
  Vue.directive(key, (directives as { [key: string ]: DirectiveOptions })[key])
})

// Register global filter functions
Object.keys(filters).forEach(key => {
  Vue.filter(key, (filters as { [key: string ]: Function })[key])
})

Vue.config.productionTip = false

// 组件不能使用 v-permission时 使用 v-if="checkPermission(['amdin, 'editor'])"
Vue.prototype.checkPermission = checkPermission

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
