<!--
 * @Author: your name
 * @Date: 2020-08-12 17:05:47
 * @LastEditTime: 2020-11-14 16:34:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\compoent\approachMultiple\approachMultiple.vue
-->
<template>
  <div style="height: 100%;">
    <query-page res="approachMultiple" :page-config="pageConfig" :loading.sync="loading"
      :tableSeleList.sync="tableSeleList" :dialogHeight="dialogHeight" @searchData="getSearchData"
      @fnName="pageConfigBtnFnName" @resetTableConfigList="pageConfigResetTableConfigList"
      @onRefresh="pageConfigOnRefresh" @pages="pageConfigPages" @dialogEvent="dialogEvent" @searchEvent="searchEvent">
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
  name: 'approachMultiple',
  mixins: [search],
  data () {
    return {
      // 查询页面基础参数
      page: new Page(),
      pageConfig: {},
      loading: false,
      // =====================
      tableSeleList: [],
      // 搜索数据
      searchData: {
        applyDateFrom: '',
        applyDateTo: '',
        contractId: null,
        contractName: '',
        createTimeFrom: '',
        createTimeTo: '',
        docNo: '',
        flowStatus: ['02'],
        partyBUnitName: '',
        projectId: null,
        projectIds: [],
        projectName: ''
      }
    };
  },
  async created () {
    await this._getTableDataList();
  },
  props: {
    dialogHeight: {
      type: Number,
      default: 300
    },
    // 选中
    paymentSelect: {
       default: () => {}
    }
  },
  methods: {
    // 获取表单
    _getTableDataList () {
      this.pageConfig.searchControls.searchData.contractId = this.paymentSelect.contractId;
      this.pageConfig.searchControls.searchData.projectId = this.paymentSelect.projectId;
      this.pageConfig.searchControls.searchData.projectIds = this.paymentSelect.projectId ? [this.paymentSelect.projectId] : [];
      this.pageConfig.searchControls.searchData.createTimeTo = this.paymentSelect.createTime;
      this.handleGetTableDataList(this.paymentSelect.url, true, () => {
        this.pageConfig.mainTable.tableData.forEach(item => {
          if (this.paymentSelect.url === 'contractIncomeCollection/getContractIncomeCollectionPage') {
            this.$set(item, 'actualPaymentAmount', item.applyCollectionAmount);
            this.$set(item, 'applyDate', item.collectionActualDate);
          }
        });
      });
    },
    handleInfo(row, type = 'info') {
      const routeName = this.paymentSelect.jumpToUrl;
      if (!routeName) return this.$message.error(this.$t('dialog.tpleaseSetToRouter')); // 请联系管理员配置跳转权限
      const jumpName = this.paymentSelect.ownPage ? `${routeName}Info` : `${routeName}Edit`;
      const translateType = type;
      type = this.$base64.encode(type);
      const id = this.$base64.encode(row.id || 0);
      const RouteTitleObj = { name: jumpName, loadRouteName: routeName, translateType };
      localStorage.setItem('RouteTitle', JSON.stringify(RouteTitleObj));
      this.$router.push(`/${jumpName}/${type}/${id}/${routeName}`);
      this.$emit('dialogClose', false);
    }
  }
};
</script>

<style scoped lang="scss">
</style>
