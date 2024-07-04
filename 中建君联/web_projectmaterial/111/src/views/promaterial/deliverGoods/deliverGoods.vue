<!--
 * @Author: your name
 * @Date: 2021-01-22 11:41:35
 * @LastEditTime: 2021-01-22 12:03:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\deliverGoods\deliverGoods.vue
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
  name: 'deliverGoods',
  mixins: [search],
  data() {
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
        supplyOrderId: 0
      },
      supplyOrderId: 0
    };
  },
  async created() {
    this.supplyOrderId = this.$base64.decode(this.$route.params.id);
    await this._getTableDataList();
  },
  methods: {
    // 获取表单
    _getTableDataList() {
      this.pageConfig.searchControls.searchData.supplyOrderId = this.$clone(this.supplyOrderId);
      this.handleGetTableDataList('supplyOrder/getDeliverList', false);
    },
    // 查看记录
    handleInfo(row) {
      const type = this.$base64.encode('info');
      const id = this.$base64.encode(row.id);
      const routeName = 'deliverGoods';
      const RouteTitleObj = { name: `${routeName}Edit`, loadRouteName: routeName, translateType: 'info' };
      localStorage.setItem('sRouteTitle', JSON.stringify(RouteTitleObj));
      this.$router.push(`/${routeName}Edit/${id}/${type}/supplyOrder`);
    }
  }
};
</script>

<style scoped lang="scss">
</style>
