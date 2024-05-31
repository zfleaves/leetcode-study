<!--
 * @Author: your name
 * @Date: 2021-01-29 17:27:42
 * @LastEditTime: 2021-01-29 17:27:42
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\views\demMonth\demMonthPlanAdjust\demMonthPlanAdjust.vue
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
              {{row[item.prop]}}{{$t('demMonthPlanAdjust.term')}}
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
    name: 'demMonthPlanAdjust',
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
        this.handleGetTableDataList('demMonthPlanAdjust/getPageList');
      },
      // 删除
      handleDelete(row) {
        const statusConfig = {
          keyId: 'monthPlanAdjustId',
          keyName: 'projectName',
          row,
          api: 'demMonthPlanAdjust/setDelete'
        };
        this.setDataDelete(statusConfig, row);
      }
    }
  };
</script>

<style scoped lang="scss">
</style>
