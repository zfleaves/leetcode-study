/*
 * @Author: your name
 * @Date: 2020-07-01 14:45:03
 * @LastEditTime: 2020-08-05 17:51:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_portal\src\util\auth.js
 */
import config from 'util/config';

const authToken = {
    // Token
    hasToken: () => {
      return localStorage.getItem('token') || '';
    },
    // 设置模拟登录Token
    setToken: (token) => {
      localStorage.setItem('token', token);
    },
    // 移除Token
    removeToken: () => {
      localStorage.removeItem('token');
    },
    // 个人信息
    hasUserInfo: () => {
      return localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : '';
    },
    // 设置个人信息资料
    setUserInfo: (data) => {
      localStorage.setItem('userInfo', JSON.stringify(data));
    },
    // 移除个人信息资料
    removeUserInfo: () => {
      localStorage.removeItem('userInfo');
    },
    // 菜单
    hasMenuRouter: () => {
      return localStorage.getItem(`${config.subSystemCode}-menu`) ? JSON.parse(localStorage.getItem(`${config.subSystemCode}-menu`)) : [];
    },
    setMenuRouter: (menu) => {
      localStorage.setItem(`${config.subSystemCode}-menu`, JSON.stringify(menu));
    },
    removeMenuRouter: () => {
      localStorage.removeItem(`${config.subSystemCode}-menu`);
    },
    // 语言设置
    hasLanguage: () => {
      return localStorage.getItem('language') || 'zh';
    },
    setLanguage: (language) => {
      localStorage.setItem('language', language);
    },
    removeLanguage: () => {
      localStorage.removeItem('language');
    },
    // 重新登录
    reLogin() {
      const language = localStorage.getItem('language') || 'zh';
      const userName = localStorage.getItem('userName');
      localStorage.clear();
      localStorage.setItem('language', language);
      localStorage.setItem('userName', userName);
    }
};
export default authToken;
