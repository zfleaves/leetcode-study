/*
 * @Author: your name
 * @Date: 2020-07-23 09:22:53
 * @LastEditTime: 2020-07-24 11:20:18
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\store\transfer.js
 */
import request from 'util/serve';
import store from '@/store';

/* eslint-disable */
class ServierTransfer {
  /**
   * @name: 把服务配置转化为actions
   * @param {Object} services 服务配置
   * @return: action数组
   */
  transToActions (services) {
    const actions = {};
    Object.keys(services).filter(key => services[key].url).forEach(key => {
      const service = services[key];
      actions[key] = this.transHook(service);
    });
    return actions;
  }

  /**
   * @name: 服务处理
   * @param {Object} service 服务配置对象
   * @param {Function} hook 返回处理函数
   * @return: vuex action 对象
   */
  transHook (service) {
    return async (action, params) => {
      if (service.loading) {
        store.commit('diaLog/set_contentLoading', {status: true, text: service.loadingText || ''})
      }
      const response = await http(service, params);
      store.commit('diaLog/set_contentLoading', {status: false, text: ''});
      return response
    };
  }
}

function http (service, params) {
  if (service.method.toLowerCase() === 'get') {
    if (service.isExport) {
      return request({
        url: service.url,
        method: 'get',
        params,
        responseType: 'arraybuffer',
      });
    } else {
      return request({
        url: service.url,
        method: 'get',
        params,
      });
    }
  } else {
    if (service.isExport) {
      return request({
        url: service.url,
        method: 'post',
        data: params,
        responseType: 'arraybuffer',
      });
    } else {
      return request({
        url: service.url,
        method: 'post',
        data: params,
      });
    }
  }

}

export default new ServierTransfer();
