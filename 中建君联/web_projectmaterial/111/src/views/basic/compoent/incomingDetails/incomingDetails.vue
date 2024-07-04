<!--
 * @Author: your name
 * @Date: 2020-08-14 16:14:36
 * @LastEditTime: 2020-08-14 16:24:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\basic\compoent\incomingDetails\incomingDetails.vue
-->
<template>
  <div style="height: 100%;">
    <query-page res="sysQueryPage" :page-config="pageConfig" :loading.sync="loading" :tableSeleList.sync="tableSeleList"
      :dialogHeight="dialogHeight" @searchData="getSearchData" @fnName="pageConfigBtnFnName"
      @resetTableConfigList="pageConfigResetTableConfigList" @onRefresh="pageConfigOnRefresh" @pages="pageConfigPages"
      @dialogEvent="dialogEvent" @searchEvent="searchEvent">
      <template slot="mainTable" slot-scope="config">
        <g-query-table :config="config.scope" :tableList.sync="tableSeleList"
          @fnName="pageConfigEmitQueryTableButtonFnName">
        </g-query-table>
      </template>
    </query-page>
  </div>
</template>

<script>
import Page from './config.js';
import { search } from 'mixins/searchMixins';
import Auth from 'util/auth';

export default {
  name: 'incomingDetails',
  mixins: [search],
  data () {
    return {
      // 查询页面基础参数
      page: new Page(),
      pageConfig: {},
      loading: false,
      // =====================
      tableSeleList: [],
      partyATypeTitle: '',
      dialogVisible: false,
      // 搜索数据
      searchData: {
        brand: '',
        materialCode: '',
        materialName: '',
        models: '',
        materialId: 0,
        standards: '',
        unit: ''
      }
    };
  },
  props: {
    dialogHeight: {
      type: Number,
      default: 300
    },
    materialId: {
      default: 0
    }
  },
  async created () {
    await this._getTableDataList();
  },
  methods: {
    // 获取表单
    _getTableDataList () {
      this.pageConfig.searchControls.searchData.materialId = this.materialId;
      this.handleGetTableDataList('materialInfo/getIncomingDetailsList', false);
    }
  }
};
</script>

<style scoped lang="scss">
</style>
