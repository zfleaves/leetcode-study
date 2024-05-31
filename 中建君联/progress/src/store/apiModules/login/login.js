/*
 * @Author: your name
 * @Date: 2020-06-28 09:08:48
 * @LastEditTime: 2020-06-28 17:07:56
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \web_basicconfiguration-施工云企业信息及配置\src\store\apiModules\login\login.js
 */
export default {
    // 密码登录
    passwordLogin: {
      url: '/basicconfiguration/passport/password/login',
      method: 'post'
    },
    // 验证token是否存在
    tokenCheckLogin: {
      url: '/basicconfiguration/passport/api/token/check',
      method: 'get'
    },
    // 退出登录
    outLogin: {
      url: '/basicconfiguration/passport/login/out',
      method: 'get'
    },
    // 获取用户的子系统菜单
    getsubSystemMenus: {
      url: '/basicconfiguration/passport/subsystem/menus',
      method: 'get'
    }
};
