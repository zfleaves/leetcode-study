import Vue from 'vue';
import VueI18n from 'vue-i18n';
import locale from 'element-ui/lib/locale';
import Auth from 'util/auth';
// 引入各个语言基础包配置文件
import zh from './config/zh'; // 中文
import en from './config/en'; // 英文

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: Auth.hasLanguage(), // 从缓存中获取当前语言类型
  messages: {
    zh,
    en
  },
  // 隐藏警告
  silentTranslationWarn: true
});
locale.i18n((key, value) => i18n.t(key, value)); // 为了实现element插件的多语言切换

export default i18n;
