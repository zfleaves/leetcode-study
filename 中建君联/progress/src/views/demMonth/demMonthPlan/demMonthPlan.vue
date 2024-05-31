<!--
 * @Author: your name
 * @Date: 2021-01-29 17:27:18
 * @LastEditTime: 2021-02-01 09:38:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\views\demMonth\demMonthPlan\demMonthPlan.vue
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
            <span slot="table-applyMonth" slot-scope="{row, item}">
              {{row[item.prop].substring(0, 4)}}{{$t('time.year')}}{{row[item.prop].substring(5, 7)}}{{$t('time.month')}}
            </span>
            <span slot="table-detailItem" slot-scope="{row, item}">
              {{row[item.prop]}}{{$t('demMonthPlan.term')}}
            </span>
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
    name: 'demMonthPlan',
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
          applyMonth: '',
          createByName: '',
          createTimeFrom: '',
          createTimeTo: '',
          docNo: '',
          flowStatus: '',
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
        this.handleGetTableDataList('demMonthPlan/getPageList');
      },
      // 删除
      handleDelete(row) {
        const statusConfig = {
          keyId: 'monthPlanId',
          keyName: 'projectName',
          row,
          api: 'demMonthPlan/setDelete'
        };
        this.setDataDelete(statusConfig, row);
      }
    }
  };
</script>

<style scoped lang="scss">
</style>
