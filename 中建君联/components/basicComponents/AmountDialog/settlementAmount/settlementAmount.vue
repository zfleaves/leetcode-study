<!--
 * @Author: your name
 * @Date: 2020-08-12 17:05:47
 * @LastEditTime: 2023-01-13 16:24:50
 * @LastEditors: zengqin 1058574586@qq.com
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
  name: 'settlementAmount',
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
        contractId: null,
        createTimeFrom: '',
        createTimeTo: '',
        docNo: '',
        flowStatus: ['02'],
        ifBelongClassify: null,
        partyBUnitName: '',
        projectId: null,
        projectIds: [],
        projectName: '',
        settlementAgentUserName: '',
        settlementDateFrom: '',
        settlementDateTo: ''
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
    settlementSelect: {
      default: () => {}
    }
  },
  methods: {
    // 获取表单
    _getTableDataList () {
      this.pageConfig.searchControls.searchData.contractId = this.settlementSelect.contractId;
      this.pageConfig.searchControls.searchData.projectId = this.settlementSelect.projectId;
      this.pageConfig.searchControls.searchData.projectIds = this.settlementSelect.projectId ? [this.settlementSelect.projectId] : [];
      this.pageConfig.searchControls.searchData.createTimeTo = this.settlementSelect.createTime;
      this.handleGetTableDataList(this.settlementSelect.url, true, () => {
        this.pageConfig.mainTable.tableData.forEach(item => {
          if (!item.totalPriceTax) {
              let totalPriceTax = item.excludeTaxAmount || item.includeTaxPrice;
              if (this.settlementSelect.url === 'scSettlement/getProsubcontractSettlementPage' ||
                  this.settlementSelect.url === 'labourSettlement/getProlabourSettlementPage') {
                  totalPriceTax = item.includeTaxAmount;
              }
              if (this.settlementSelect.url === 'contractIncomePayment/getContractIncomeProgresspaymentPage') {
                  totalPriceTax = item.actualPassedAmount;
                  this.$set(item, 'settlementDate', item.declareDate);
              }
              if (this.$utils.config.subSystemCode === 'supply' && this.settlementSelect.url === 'purchaseSettlement/getPageList') {
                  totalPriceTax = item.totalIncludeTaxAmount;
              }
              this.$set(item, 'totalPriceTax', totalPriceTax);
          }
          if (!item.settlementDate) {
            const settlementDate = item.settlementTime;
            this.$set(item, 'settlementDate', settlementDate);
          }
        });
      });
    },
    handleInfo(row, type = 'info') {
      const routeName = this.settlementSelect.jumpToUrl;
      if (!routeName) return this.$message.error(this.$t('dialog.tpleaseSetToRouter')); // 请联系管理员配置跳转权限
      const jumpName = this.settlementSelect.ownPage ? `${routeName}Info` : `${routeName}Edit`;
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
