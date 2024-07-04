/*
 * @Author: your name
 * @Date: 2020-06-28 09:08:48
 * @LastEditTime: 2021-09-13 11:40:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_basicconfiguration-施工云企业信息及配置\src\main.js
 */
/* eslint-disable */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Utils from 'util'
import 'util/directives.js'
import '@/mixins/promission/index.js'
import elemntUI from 'element-ui'
Vue.use(elemntUI)
/**
 * 此处解决低版本的vue-router报错问题：连续点击一个页面跳转按钮会报错
 * 更简单的方法时更新vue-router到最新版本：npm i vue-router@3.0 -S
 */
import Router from 'vue-router'
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

import i18n from '@/mixins/i18n/index.js'

import 'element-ui/lib/theme-chalk/index.css'
import './components/basicComponents/styles/index.scss'
const Base64 = require('js-base64');
import filters from './mixins/filters/index';
// 注册全局过滤器
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));

// 引入全局组件
import g_subgroup from './components/basicComponents/global'
import g_headNavigation from './components/basicComponents/headNavigation'

Vue.config.productionTip = false;
Vue.prototype.$utils = Utils;
Vue.prototype.$base64 = Base64.Base64;
Vue.prototype.$clone = (value = {}) => {
  return JSON.parse(JSON.stringify(value));
}

Vue.use(g_subgroup)
Vue.use(g_headNavigation)

Vue.prototype.getLoading = (text = '') => {
  return Vue.prototype.$loading({
    lock: true,
    text: text,
    background: 'rgba(0,0,0,0.7)',
    spinner: 'el-icon-loading',
  })
}
// 禁止快速点击
Vue.directive('fastClick', {
  inserted(el, binding) {
    el.addEventListener('click', () => {
      if (!el.disabled) {
        el.disabled = true;
        let disabledTime = setTimeout(() => {
          el.disabled = false;
          clearTimeout(disabledTime);
        }, binding.value || 300)
      }
    })
  }
})
new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");
