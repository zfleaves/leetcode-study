<template>
  <el-dropdown trigger="hover">
    <span class="el-dropdown-link" style="cursor: pointer;">
      {{localeName}}
      <i class="el-icon-arrow-down el-icon--right"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="$i18n.locale === item.type" v-for="(item,index) in languageList" :key="index"
        @click.native="changeLanguageType(item)">
        {{item.name}}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import Auth from 'util/auth';

export default {
  name: 'language',
  inject: ['reload'],
  data () {
    return {
      languageList: [
        { type: 'zh', name: '中文' },
        { type: 'en', name: 'English' }
      ],
      localeLanguage: 'zh',
      localeName: '中文',
      requsetFlag1: false,
      requsetFlag2: false,
      requsetFlag3: false
    };
  },
  created () {
    // this._getLanguageTypeList();
    this.localeLanguage = Auth.hasLanguage() || 'zh';
    this._getLanguageAllList();
  },
  methods: {
    // 获取语言包类型
    _getLanguageTypeList () {
      // getLanguageTypePublic
      let url = '';
      if (this.$route.name === 'login') {
        url = 'publicApi/getLanguageTypePublic';
      } else {
        url = 'publicApi/getLanguageTypeEffectivePublic';
      }
      this.$store.dispatch(url).then(res => {
        if (res.status === 0) {
          const data = [];
          // console.log(res.results, 'res.results');
          res.results.forEach(item => {
            data.push({
              type: item.languageCode,
              name: item.languageName
            });
          });
          this.languageList = data;
          const index = this.languageList.findIndex(v => v.type === this.localeLanguage);
          this.localeName = index >= 0 ? this.languageList[index].name : '中文';
        }
      });
    },
    _getLanguageAllList (type) {
      if (!type) {
        type = this.localeLanguage;
      }
      this._setLanguageValues(type);
    },
    async _setLanguageValues (type) {
      localStorage.setItem('loadMenuLanguag', 0);
      this.$i18n.locale = type;
      // 语言设置中。。。。
      const languageObj = this.$i18n.messages[type];
      if (this.$route.name !== 'login') {
        let loading = '';
        loading = this.$loading({
          lock: true,
          background: 'rgba(0,0,0,0.7)',
          spinner: 'el-icon-loading'
        });
        // await this._languageValues(languageObj, loading, () => {
        //   this.$i18n.mergeLocaleMessage(type, languageObj);
        //   document.title = this.$t(`subSystem.${this.$utils.config.subSystemCode}`);
        // });
        this.requsetFlag1 = false;
        this.requsetFlag2 = false;
        this.requsetFlag3 = false;
        this._languageValues(languageObj, loading);
        this._languageValuesPage(languageObj, loading);
        this._getLanguageSubSystemCodeValues(languageObj, loading);
      }
    },
    setAllLanguage (languageObj, loading) {
      if (this.requsetFlag1 && this.requsetFlag2 && this.requsetFlag3) {
        const type = Auth.hasLanguage();
        this.$i18n.mergeLocaleMessage(type, languageObj);
        document.title = this.$t(`subSystem.${this.$utils.config.subSystemCode}`);
        loading.close();
      }
    },
    // menu  接口1
    _languageValues (languageObj, loading, callback) {
      const params = {
        subSystemCode: this.$utils.config.basicSystemCode,
        pageCode: this.$utils.config.pageMenuCode
      };
      this.$store.dispatch('publicApi/languageValues', params).then(res => {
        if (!res.results) res.results = [];
        const paramsBc = {
          subSystemCode: this.$utils.config.subSystemCode,
          pageCode: this.$utils.config.pageMenuCode
        };
        this.$store.dispatch('publicApi/languageValues', paramsBc).then(resBc => {
          if (!resBc.results) resBc.results = [];
          const menuObj = {...this.setLanguage(resBc.results), ...this.setLanguage(res.results)};
          this.$set(languageObj, 'menu', menuObj);
          this.requsetFlag1 = true;
          this.setAllLanguage(languageObj, loading);
          localStorage.setItem('loadMenuLanguag', 1);
        }).catch(e => {
          this.requsetFlag1 = true;
          loading.close();
        });
      }).catch(e => {
        this.requsetFlag1 = true;
        loading.close();
      });
    },
    // 页面 接口2
    _languageValuesPage (languageObj, loading, callback) {
      const pageCode = this.$route.params && this.$route.params.translateName ? this.$route.params.translateName : this.$route.name;
      const paramsPath = {
        subSystemCode: this.$utils.config.subSystemCode,
        pageCode
      };
      this.$store.dispatch('publicApi/languageValues', paramsPath).then(res => {
        this.requsetFlag2 = true;
        if (res.results.length === 0) {
          // console.log(res, 'res');
        } else {
          this.$set(languageObj, paramsPath.pageCode, this.setLanguage(res.results));
        }
        this.setAllLanguage(languageObj, loading);
        // this._getLanguageSubSystemCodeValues(languageObj, loading, callback);
      }).catch(e => {
        loading.close();
      });
    },
    // 通用  接口3
    _getLanguageSubSystemCodeValues (languageObj, loading, callback) {
      this.requsetFlag3 = true;
      this.$store.dispatch('publicApi/getLanguageSubSystemCodeValues').then(res => {
        if (res.results.length === 0) {
          //  console.log(res, 'res');
        } else {
          languageObj = Object.assign(languageObj, this.setLanguageCommon(res.results));
        }
        this.setAllLanguage(languageObj, loading);
        // callback && callback();
        // 语言设置结束
        // loading.close();
      }).catch(e => {
        loading.close();
      });
    },
    // 语言切换
    async changeLanguageType (item) {
      this.localeName = item.name;
      Auth.setLanguage(item.type);
      this.localeLanguage = Auth.hasLanguage();
      this.loadHomeLanguageValues(item.type);
    },
    // 加载首页语言包
    loadHomeLanguageValues (type) {
      const languageObj = this.$i18n.messages[type];
      const paramsPath = {
        subSystemCode: this.$utils.config.subSystemCode,
        pageCode: 'home'
      };
      this.$store.dispatch('publicApi/languageValues', paramsPath).then(res => {
        if (res.results.length === 0) {
          // console.log(res, 'res');
        } else {
          this.$set(languageObj, paramsPath.pageCode, this.setLanguage(res.results));
        }
        this.$i18n.mergeLocaleMessage(type, languageObj);
        // this.reload();
        location.reload();
      }).catch(e => {
      });
    },
    setLanguage (arr) {
      const obj = {};
      for (const i in arr) {
        const item = arr[i];
        this.$set(obj, item.columnCode, item.languageValue);
      }
      return obj;
    },
    // 获取通用语言后进行数据处理
    setLanguageCommon (languageArr) { // 遍历后台传来的路由字符串，转换为组件对象
      const languageObj = {};
      languageArr.forEach(item => {
        if (languageObj[item.pageCode]) {
          this.$set(languageObj[item.pageCode], item.columnCode, item.languageValue);
        } else {
          this.$set(languageObj, item.pageCode, { [item.columnCode]: item.languageValue });
        }
      });
      return languageObj;
    }
  }
};
</script>

<style scoped lang="scss">
.el-dropdown-link{
  color: white;
  font-size: 16px;
  margin-left: 20px;
}
</style>
