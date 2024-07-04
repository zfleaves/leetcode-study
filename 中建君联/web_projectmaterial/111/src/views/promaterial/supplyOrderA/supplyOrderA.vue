<!--
 * @Author: your name
 * @Date: 2020-07-30 10:33:54
 * @LastEditTime: 2021-01-22 14:57:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\supplyOrderA\supplyOrderA.vue
-->
<template>
  <div>
    <query-page res="sysQueryPage" :page-config="pageConfig" :loading.sync="loading" :tableSeleList.sync="tableSeleList"
      @searchData="getSearchData" @fnName="pageConfigBtnFnName" @resetTableConfigList="pageConfigResetTableConfigList"
      @onRefresh="pageConfigOnRefresh" @pages="pageConfigPages" @searchEvent="searchEvent">
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
  name: 'supplyOrderA',
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
        docNo: '',
        flowStatus: '',
        projectName: '',
        orderName: '',
        releaseDateFrom: '',
        releaseDateTo: '',
        supplierName: '',
        modelType: '02'
      },
      partybNotice: {},
      partybShow: false,
      partybError: '',
      isDisPartyb: false
    };
  },
  async created () {
    await this._getTableDataList();
  },
  methods: {
    // 获取表单
    _getTableDataList () {
      this.handleGetTableDataList('supplyOrder/getPageList');
    },
    // 删除
    handleDelete (row) {
      const statusConfig = {
        keyId: 'supplyOrderAId',
        keyName: 'projectName',
        row,
        api: 'supplyOrder/setDelete'
      };
      this.setDataDelete(statusConfig, row);
    }
  }
};
</script>

<style scoped lang="scss">
.search_cons {
  padding: 20px;
  box-sizing: border-box;
  p {
    margin-bottom: 20px;
  }
}
</style>
