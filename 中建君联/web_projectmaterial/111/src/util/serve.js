/*
 * @Author: your name
 * @Date: 2020-07-13 09:00:27
 * @LastEditTime: 2020-08-26 10:07:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_unit\src\util\serve.js
 */
/**
 * axios全局配置，包括验证校验及错误处理
 */
/* eslint-disable */
import axios from 'axios';
import store from 'store';
import Utils from 'util';
import config from './config';

const CancelToken = axios.CancelToken;
let cancel;

// 创建axios实例

const service = axios.create({
  baseURL: config.url,
  // timeout: 5000 // 请求超时时间
});
/*
* 添加一个请求拦截器
 */

service.interceptors.request.use(
  config => {
    config.cancelToken = new CancelToken((c) => {
      cancel = c;
    });
    const token = Utils.storage.get('token') || '';
    const language = Utils.storage.get('language') || 'zh';
    const userId = Utils.storage.get('userInfo') ? JSON.parse(Utils.storage.get('userInfo')).userId : 0;
    const tenantId = Utils.storage.get('userInfo') ? JSON.parse(Utils.storage.get('userInfo')).tenantId : 0;
    // Access-Domain: backstage(后台) / customer(前台)
    config.headers['Access-Token'] = token;
    config.headers['Access-Domain'] = 'customer';
    config.headers['Language'] = language;
    config.headers['userId'] = userId;
    config.headers['tenantId'] = tenantId;
    config.headers['resource'] = 'P2';
    return config;
  },
  err => {
    return Promise.reject(err);
  },
);
/*
* http response 拦截器
* 针对响应代码确认跳转到对应页面
 */
service.interceptors.response.use(
  response => {
    if (response.data.status === 1) {
      // Message({
      //   type: 'error',
      //   message: response.data.errorMessage
      // });
    }
    // else if (response.data.status === 0) {

    // }
    return response.data;
  },
  error => {
    if (error.response) {
      store.commit('diaLog/set_contentLoading', {status: false, text: ''});
      switch (error.response.status) {
        case 401:
          if (Utils.storage.get('token')) {
            store.commit('user/SET_OVERDUETOKEN', true);
          }
          break;
        case 403:
          break;
        case 404:
          break;
        case 405:
          break;
        default:
      }
      return Promise.reject(error.response.data);
    }
  },
);

export default service;
