<!--
 * @Author: your name
 * @Date: 2020-07-30 10:43:17
 * @LastEditTime: 2022-10-22 11:44:34
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\paymentApply\paymentApply.vue
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
    name: 'materialPaymentSupplier',
    mixins: [search],
    data () {
      return {
        // 查询页面基础参数
        page: new Page(),
        pageName: 'paymentApply',
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
            contractName: '',
            createTimeFrom: '',
            createTimeTo: '',
            docNo: '',
            flowStatus: [],
            partyBUnitName: '',
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
        this.handleGetTableDataList('materialPaymentSupplier/getPageList');
      },
      // 增、改、查 路由跳转设置
      handleSetRouter(type, row = {}) {
        const translateType = type;
        type = this.$base64.encode(type);
        const id = this.$base64.encode(row.id || 0);
        const RouteTitleObj = { name: `${this.$route.name}Edit`, loadRouteName: this.$route.name, translateType };
        localStorage.setItem('RouteTitle', JSON.stringify(RouteTitleObj));
        this.$router.push(`/${this.$route.name}Edit/${type}/${id}/${this.pageName}`);
      }
    }
  };
</script>

<style scoped lang="scss">
</style>
