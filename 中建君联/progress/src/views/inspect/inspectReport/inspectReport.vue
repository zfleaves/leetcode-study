<!--
 * @Author: your name
 * @Date: 2021-04-14 09:37:00
 * @LastEditTime: 2021-04-14 17:44:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\views\inspect\inspectReport\inspectReport.vue
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
            <!-- 巡检类型 -->
            <template slot="table-inspectTypeValue" slot-scope="{row, item}">
              <span>{{$t(row[item.prop])}}</span>
            </template>
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
    name: 'inspectReport',
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
            flowStatus: [],
            applyDateFrom: '',
            applyDateTo: '',
            createByName: '',
            projectName: ''
        }
      };
    },
    async created () {
      await this._getTableDataList();
    },
    methods: {
      // 获取表单
      _getTableDataList () {
        this.handleGetTableDataList('inspectReport/getPageList');
      },
      // 删除
      handleDelete(row) {
        const statusConfig = {
          keyId: 'inspectReportId',
          keyName: 'projectName',
          row,
          api: 'inspectReport/setDelete'
        };
        this.setDataDelete(statusConfig, row);
      }
    }
  };
</script>

<style scoped lang="scss">
</style>
