<!--
 * @Author: your name
 * @Date: 2020-07-23 09:53:28
 * @LastEditTime: 2022-08-29 17:34:39
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\basic\materialInfo\materialInfo.vue
-->
<template>
  <div>
    <query-page res="sysQueryPage" :page-config="pageConfig" :loading.sync="loading" :tableSeleList.sync="tableSeleList"
      @searchData="getSearchData" @fnName="pageConfigBtnFnName" @resetTableConfigList="pageConfigResetTableConfigList"
      @onRefresh="pageConfigOnRefresh" @pages="pageConfigPages" @searchEvent="searchEvent">
      <template slot="mainTable" slot-scope="config">
        <g-query-table ref="materialQueryTable" :config="config.scope" :tableList.sync="tableSeleList"
          @fnName="pageConfigEmitQueryTableButtonFnName">
        </g-query-table>
      </template>
    </query-page>
  </div>
</template>

<script>
import Page from './config.js';
import { search } from 'mixins/searchMixins';

export default {
  name: 'materialInfo',
  mixins: [search],
  data () {
    return {
      // 查询页面基础参数
      page: new Page(),
      pageConfig: {},
      loading: false,
      // =====================
      tableSeleList: [],
      // 搜索数据
      searchData: {
        brand: '',
        materialCode: '',
        materialName: '',
        models: '',
        standards: '',
        varietiesName: ''
      }
    };
  },
  async created () {
    await this._getTableDataList();
  },
  methods: {
    // 获取表单
    async _getTableDataList () {
        this.handleGetTableDataList('materialInfo/getBasematerialDetailPage');
    }
  }
};
</script>

<style scoped lang="scss">
</style>
