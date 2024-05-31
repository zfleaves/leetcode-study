<!--
 * @Author: your name
 * @Date: 2021-04-14 09:41:24
 * @LastEditTime: 2021-04-14 13:58:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\views\durationRisk\durationRiskSummary\durationRiskSummary.vue
-->
<template>
  <div>
    <query-page
        res="sysQueryPage"
        :page-config="pageConfig"
        :loading.sync="loading"
        :tableSeleList.sync="tableSeleList"
        @searchData="getSearchData"
        @fnName="pageConfigBtnFnName"
        @resetTableConfigList="pageConfigResetTableConfigList"
        @onRefresh="pageConfigOnRefresh"
        @pages="pageConfigPages"
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
  import {search} from 'mixins/searchMixins';
  import Auth from 'util/auth';

  export default {
    name: 'durationRiskSummary',
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
            applyDateFrom: '',
            applyDateTo: '',
            orgName: '',
            projectName: '',
            riskContent: ''
        }
      };
    },
    async created () {
      await this._getTableDataList();
    },
    methods: {
      // 获取表单
      _getTableDataList () {
        this.handleGetTableDataList('durationRiskSummary/getPageList');
      }
    }
  };
</script>

<style scoped lang="scss">
.entryTypeValue {
  font-size: 14px;
  width: 100%;
  padding: 2px 10px;
  &.entryTypeValue01 {
    color: #2b74ec;
    background-color: rgba(43,116,236, 0.2);
  }
  &.entryTypeValue02 {
    color: rgb(246,141,91);
    background-color: rgb(253,223,208);
  }
  &.entryTypeValue03 {
    color: #24b568;
    background-color: rgba(36,181,104, 0.2);
  }
  &.entryTypeValue04 {
    color: #f73535;
    background-color: rgba(247,53,53, 0.2);
  }
}
</style>
