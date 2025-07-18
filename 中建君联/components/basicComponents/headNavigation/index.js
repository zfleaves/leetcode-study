/*
 * @Author: your name
 * @Date: 2020-07-02 18:03:14
 * @LastEditTime: 2020-07-02 18:06:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_basicconfiguration\src\components\headNavigation\index.js
 */
// 全局组件
import Vue from 'vue';
import headNavigation from './headNavigation.vue';

const components = {
  'headNavigation': headNavigation
};


Object.keys(components).forEach(name => Vue.component(name, components[name]));

export default {};
