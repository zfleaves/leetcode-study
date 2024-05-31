<!--
 * @Author: your name
 * @Date: 2021-02-01 17:09:08
 * @LastEditTime: 2021-02-02 09:15:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\views\demWeek\demWeekPlan\demWeekPlan.vue
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
            <span slot="table-applyDate" slot-scope="{row, item}">
              {{row[item.prop] && row[item.prop].substring(0, 4)}}{{$t('time.year')}}{{row[item.prop] && row[item.prop].substring(5, 7)}}{{$t('time.month')}}
              {{$t('tips.theFirst')}}{{row.applyWeek}}{{$t('time.week')}}
            </span>
            <span slot="table-detailItem" slot-scope="{row, item}">
              {{row[item.prop]}}{{$t('weekPlan.term')}}
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
    name: 'demWeekPlan',
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
            week: '',
            applyDate: '',
            applyWeek: '',
            createByName: '',
            createTimeFrom: '',
            createTimeTo: '',
            docNo: '',
            flowStatus: '',
            projectName: ''
        },
        week: ''
      };
    },
    async created () {
      await this._getTableDataList();
    },
    methods: {
      // 获取表单
      _getTableDataList () {
        const applyDate = this.pageConfig.searchControls.searchData.applyDate;
        if (applyDate) {
          this.week = this.getWeekInMonth(new Date(applyDate));
          this.pageConfig.searchControls.searchData.applyWeek = this.week;
          if (this.pageConfig.searchControls.searchData.applyDate.indexOf('00:00:00') >= 0) {
            this.pageConfig.searchControls.searchData.applyDate = `${applyDate}`;
          } else {
            this.pageConfig.searchControls.searchData.applyDate = `${applyDate} 00:00:00`;
          }
        } else {
          this.pageConfig.searchControls.searchData.applyWeek = '';
          this.pageConfig.searchControls.searchData.applyDate = '';
        }
        this.handleGetTableDataList('demWeekPlan/getPageList');
      },
      // 根据日期判断是月的第几周
      getWeekInMonth(t) {
        if (t === undefined || t === '' || t == null) {
          t = new Date();
        } else {
          const _t = new Date();
          _t.setYear(t.getFullYear());
          _t.setMonth(t.getMonth());
          _t.setDate(t.getDate());
          const date = _t.getDate(); // 给定的日期是几号
          _t.setDate(1);
          const d = _t.getDay(); // 1. 得到当前的1号是星期几。
          let fisrtWeekend = d;
          if (d === 0) {
              fisrtWeekend = 1;
              // 1号就是星期天
          } else {
              fisrtWeekend = 7 - d + 1; // 第一周的周未是几号
          }
          if (date <= fisrtWeekend) {
              return 1;
          } else {
              return 1 + Math.ceil((date - fisrtWeekend) / 7);
          }
        }
      },
      // 删除
      handleDelete(row) {
        const statusConfig = {
          keyId: 'weekPlanId',
          keyName: 'projectName',
          row,
          api: 'demWeekPlan/setDelete'
        };
        this.setDataDelete(statusConfig, row);
      }
    }
  };
</script>

<style scoped lang="scss">
</style>
