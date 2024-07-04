<!--
 * @Author: wumaoxia 1805428335@qq.com
 * @Date: 2022-10-22 10:03:45
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @LastEditTime: 2022-10-22 11:45:29
 * @FilePath: \web_projectlabour\src\views\projectlabour\supplierSettlementDeclaration\supplierSettlementDeclaration.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
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
    name: 'supplierSettlementDeclaration',
    mixins: [search],
    data () {
      return {
        // 查询页面基础参数
        page: new Page(),
        pageName: 'purchaseSettlement',
        pageConfig: {},
        loading: false,
        // =====================
        tableSeleList: [],
        // 搜索数据
        searchData: {
          flowStatus: [],
          contractId: '',
          createTimeFrom: '',
          createTimeTo: '',
          docNo: '',
          projectName: '',
          settlementAgentUserName: '',
          settlementDateFrom: '',
          settlementDateTo: '',
          supplierName: ''
        }
      };
    },
    async created () {
      await this._getTableDataList();
    },
    methods: {
      // 获取表单
      _getTableDataList () {
        this.handleGetTableDataList('supplierSettlementDeclaration/getPageList');
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
