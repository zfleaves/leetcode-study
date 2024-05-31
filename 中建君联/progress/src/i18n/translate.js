/*
 * @Author: your name
 * @Date: 2020-06-28 09:08:48
 * @LastEditTime: 2020-06-28 17:06:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_basicconfiguration-施工云企业信息及配置\src\i18n\translate.js
 */
import Auth from 'util/auth';

export function generateTitle (item) {
  const languageData = this.$i18n.getLocaleMessage(Auth.hasLanguage());
  if (languageData.route[item.name]) {
    return languageData.route[item.name];
  }
  return item.title;
}
