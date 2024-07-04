<!--
 * @Author: your name
 * @Date: 2021-08-27 11:22:03
 * @LastEditTime: 2022-05-19 11:32:29
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \project_web\src\views\procurementImplementation\components\sourcingResults\sourcingResults.vue
-->


<template>
  <div style="height: 100%;">
    <query-page
        res="sysQueryPage"
        :page-config="pageConfig"
        :loading.sync="loading"
        :tableSeleList.sync="tableSeleList"
        :dialogHeight="dialogHeight - 10"
        @searchData="getSearchData"
        @fnName="pageConfigBtnFnName"
        @resetTableConfigList="pageConfigResetTableConfigList"
        @onRefresh="pageConfigOnRefresh"
        @pages="pageConfigPages"
        @dialogEvent="dialogEvent"
        @searchEvent="searchEvent">
        <template slot="mainTable" slot-scope="config">
          <g-query-table
            :config="config.scope"
            :tableList.sync="tableSeleList"
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
  name: 'rushbackPage',
  mixins: [search],
  components: {},
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
        incomingDateFrom: '',
        incomingDateTo: '',
        incomingTypeCode: '',
        projectIds: [],
        projectName: '',
        supplierName: ''
      }
    };
  },
  async created () {
    await this._getTableDataList();
  },
  mounted () { },
  props: {
    dialogHeight: {
        type: Number,
        default: 280
    },
    projectId: {
      default: 0
    },
    selectId: {
      default: 0
    }
  },
  methods: {
    // 获取表单
    _getTableDataList () {
      this.pageConfig.mainTable.selectedList = [{ id: this.selectId }];
      this.pageConfig.searchControls.searchData.projectIds = [this.projectId];
      this.handleGetTableDataList('warIncoming/getRushbackPageList');
    }
  }
};
</script>

<style scoped lang="scss">
</style>

