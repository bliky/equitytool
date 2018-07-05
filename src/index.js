import 'babel-polyfill'
import Vue from 'vue'
import Router from 'vue-router'
import FastClick from 'fastclick'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import './lib/common.less'
// routes
import routes from './routes'
import routerBeforeEach from './routerBeforeEach'

Vue.use(Router)
Vue.use(ElementUI)

let router = new Router({
  mode: 'history',
  routes
})

router.beforeEach(routerBeforeEach)

new Vue({
  router
}).$mount('#app')

FastClick.attach(document.body)
