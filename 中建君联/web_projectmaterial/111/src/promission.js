/*
 * @Author: your name
 * @Date: 2020-07-08 18:35:05
 * @LastEditTime: 2021-07-26 15:55:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_basicconfiguration\src\promission.js
 */
/* eslint-disable */
import Vue from 'vue';
import Router from 'vue-router';
import router from 'router';
import store from 'store';
import Auth from 'util/auth';
import NProgress from "nprogress";
import 'nprogress/nprogress.css'
import Utils from 'util';
import whiteList from './router/whiteList.js';
import Layout from 'views/lyout/index.vue'; // Layout 是架构组件，不在后台返回，在文件里单独引入
import Error404 from 'views/error/404.vue';
import i18n from '@/mixins/i18n/index.js';
import {constantRouterMap} from './router/index.js'; // 自己配置的静态路由

const _import = require(`router/_import_${process.env.NODE_ENV}`); // 获取组件的方法


const buttonList = [];
const language = Utils.storage.get('language') || 'zh';
let getRouter; // 用来获取后台拿到的路由
// 404 路由
const error = [{
  path: '*',
  name: 'Error404',
  component: Error404,
}];

// 路由拦截

router.beforeEach((to, from, next) => {
   // 开启进度条
   NProgress.start();
  if (Auth.hasToken()) {
    // 如果当前处于登录状态，并且跳转地址为login，则自动跳回系统首页
    // 这种情况出现在手动修改地址栏地址时
    if (to.path === '/login') {
      next({path: '/home', replace: true});
    } else if (to.path.indexOf('/error') >= 0) {
      // 防止因重定向到error页面造成beforeEach死循环
      next();
    } else {
      // next();
      const hasRouter = store.state.user.hasRouter;
      if (!hasRouter) { // 不加这个判断，路由会陷入死循环
        if (Auth.hasMenuRouter().length === 0) { // 没有获取菜单
          store.dispatch('login/tokenCheckLogin', {token: Auth.hasToken()}).then(ret => {
            if (!ret.results) {
              store.dispatch('login/getsubSystemMenus', {subSystemCode: Utils.config.subSystemCode}).then(res => {
                if (res.results && res.results.length > 0) {
                  getRouter = res.results;
                } else {
                  getRouter = [];
                }
                setRouter(getRouter);
                Auth.setMenuRouter(getRouter); // 存储路由到localStorage
                store.commit('user/set_hasRouter'); // 设置已存在缓存路由
                routerGo(to, next);
              });
            } else {
              Utils.commonUtil.resetVuex(); // 清除数据仓库
              Auth.reLogin();
              // next({path: '/login', replace: true});
              window.location.href = `${Utils.config.jumpUrl}/portal/#/login`;
              window.close();
            }
          });
        } else { // 从localStorage拿到了路由
          store.dispatch('login/tokenCheckLogin', {token: Auth.hasToken()}).then(res => {
            if (!res.results) {
              getRouter = Auth.hasMenuRouter(); // 拿到路由
              store.commit('user/set_hasRouter'); // 设置已存在缓存路由
              routerGo(to, next);
            } else {
              Utils.commonUtil.resetVuex(); // 清除数据仓库
              Auth.reLogin();
              // next({path: '/login', replace: true});
              window.location.href = `${Utils.config.jumpUrl}/portal/#/login`;
              window.close();
            }
          });
        }
      } else {
        setMenuLanguage(to, next);
        /*
        *  获取当前页面的权限按钮菜单
        *  获取上一个页面的路由
        */
        // const authButtonList = Utils.menu.getCurrentButton(to.name);
        // if (authButtonList && authButtonList.length) {
        //   to.meta.authButtonList = JSON.parse(JSON.stringify(authButtonList));
        // } else {
        //   to.meta.authButtonList = [];
        // }
        // // to.meta.prevRouter = from;
        // next();
      }
    }
  } else {
    // 如果是免登录的页面则直接进入，否则跳转到登录页面
    if (whiteList.indexOf(to.name) >= 0) {
      getRouter = null;
      next();
    } else {
      // next({path: '/login', replace: true});
      window.location.href = `${Utils.config.jumpUrl}/portal/#/login`;
      window.close();
      getRouter = null;
      // 如果store中有token，同时Cookie中没有登录状态
    }
  }

});

router.afterEach(() => {
  // 关闭进度条
  NProgress.done();
});
export function getButtonResources (arr) {
  for (const i in arr) {
    const item = arr[i];
    if (item.flg === '2') {
      buttonList.push(item);
    }
    if (item.children && item.children.length) {
      getButtonResources(item.children);
    }
  }
}

export function setRouter (arr) {
  if (!arr.length) {
    return arr;
  } else {
    for (const i in arr) {
      const item = arr[i];
      item.pathLanguage = item.path;
      item.path = '';
      item.component = 'Layout';
      item.meta = {};
      item.meta.title = item.resName;
      item.meta.name = item.resName;
      item.meta.isCached = item.cached;
      item.meta.icon = item.icon;
      for (const j in item.children) {
        const child = item.children[j];
        child.component = child.resUrl;
        child.name = child.path;
        child.meta = {};
        child.meta.title = child.resName;
        child.meta.name = child.resName;
        child.meta.isCached = child.cached;
        child.meta.pathLanguage = child.path;
        child.meta.icon = child.icon;
      }
    }
    return arr;
  }
}

function routerGo (to, next) {
  getRouter = filterAsyncRouter(getRouter); // 过滤路由
  const newRouter = getRouter.concat(error);
  router.$addRoutes(newRouter);
  // 将路由数据传递给全局变量，做侧边栏菜单渲染工作
  next({...to, replace: true});
}

function filterAsyncRouter (asyncRouterMap) { // 遍历后台传来的路由字符串，转换为组件对象

  const accessedRouters = asyncRouterMap.filter(route => {
    if (route.component) {
      if (route.component === 'Layout') { // Layout组件特殊处理
        route.component = Layout;
      } else {
        route.component = _import(route.component);
      }
    }
    if (route.children && route.children.length) {

      route.children = filterAsyncRouter(route.children);
    }
    return true;
  });

  return accessedRouters;
}

function setLanguage (arr) {
  const obj = {};
  for (const i in arr) {
    const item = arr[i];
    Vue.set(obj, item.columnCode, item.languageValue);
  }
  return obj;
}
// 获取通用语言后进行数据处理
function setLanguageCommon (languageArr) { // 遍历后台传来的路由字符串，转换为组件对象
  let languageObj = {};
  languageArr.forEach(item => {
    if(languageObj[item.pageCode]) {
      Vue.set(languageObj[item.pageCode], item.columnCode, item.languageValue)
    }else{
      Vue.set(languageObj, item.pageCode, {[item.columnCode]: item.languageValue})
    }
  })
  return languageObj;
}

router.$addRoutes = (params) => {
  router.matcher = new Router({ // 重置路由规则
    routes: constantRouterMap,
  }).matcher;
  router.addRoutes(params); // 添加路由
};
// 国际化
function setMenuLanguage (to, next) {
  const pageName = to.params && to.params.translateName ? to.params.translateName : to.name;
  const params = {
    subSystemCode: Utils.config.subSystemCode,
    pageCode: pageName,
  };
  store.dispatch('publicApi/languageValues', params).then(res => {
    if (res.results.length === 0) {
      toRouter(to, next);
    } else {
      let languageObj = i18n.messages[language];
      Vue.set(languageObj, pageName, setLanguage(res.results));
      i18n.setLocaleMessage(language, Object.assign(languageObj));
      getLanguageSubSystemCodeValues(to, next);
    }
  });
}
// 通用国际化
function getLanguageSubSystemCodeValues(to, next) {
  store.dispatch('publicApi/getLanguageSubSystemCodeValues').then(res => {
    if (res.results.length === 0) {
    } else {
      let languageObj = i18n.messages[language];
      i18n.mergeLocaleMessage(language, Object.assign(languageObj, setLanguageCommon(res.results)));
    }
    toRouter(to, next);
  });
}
// 跳转路由
function toRouter(to, next) {
  const authButtonList = Utils.menu.getCurrentButton();
  if (authButtonList && authButtonList.length) {
    to.meta.authButtonList = JSON.parse(JSON.stringify(authButtonList));
  } else {
    to.meta.authButtonList = [];
  }
  next();
}