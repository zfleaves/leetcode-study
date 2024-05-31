/*
 * @Author: your name
 * @Date: 2020-06-28 09:08:48
 * @LastEditTime: 2020-06-28 17:05:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_basicconfiguration-施工云企业信息及配置\src\i18n\config\zh.js
 */
import zhLocale from 'element-ui/lib/locale/lang/zh-CN';

const zh = {
    errorCode: {
      20001001: '账号或密码错误',
      40001005: '密码验证失败'
    },
    globalData: {
      browserTitle: '',
      currentLanguage: '中文',
      noData: '暂无数据',
      serialNumber: '序号',
      putItAway: '收起',
      open: '展开',
      tips: '提示',
      signOut: '退出',
      exitTheSystem: '退出系统'
    },
    login: {
      title: '欢迎使用施工管理云',
      logIn: '登录',
      username: '手机号/账号/邮箱',
      usernameErrorTips: '手机号/账号/邮箱不能为空',
      password: '密码',
      passwordErrorTips: '密码不能为空',
      rememberPassword: '记住密码',
      forgetPassword: '忘记密码',
      footer: '版权所有：中建君联（广州）软件科技有限公司 | 建议使用火狐，谷歌浏览器 | ICP备18134766号'
    },
    ...zhLocale
};
export default zh;
