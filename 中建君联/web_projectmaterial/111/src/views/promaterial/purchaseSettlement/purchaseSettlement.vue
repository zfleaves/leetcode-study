<!--
 * @Author: your name
 * @Date: 2021-10-08 14:40:16
 * @LastEditTime: 2022-06-22 16:22:57
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \web_projectmaterial-项目材料管理\src\views\promaterial\purchaseSettlement\purchaseSettlement.vue
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
    <!-- 关联发票 -->
    <g-dialog v-if="dialogSettlementInvoice" :dialogConfig="dialogSettlementConfigInvoice" :isVisible.sync="dialogSettlementInvoice">
        <invoiceMultiple slot="body" slot-scope="{height}" :dialogHeight="height"
            :close.sync="dialogSettlementInvoice"
            :selectList="selectSettlementInvoiceList"
            :contractId="settlementInvoiceContractId"
            :projectId="settlementInvoiceProjectId"
            @getData="getSettlementInvoiceData" v-if="dialogSettlementInvoice">
        </invoiceMultiple>
    </g-dialog>
  </div>
</template>

<script>
  import Page from './config.js';
  import {search} from 'mixins/searchMixins';
  import Auth from 'util/auth';

  export default {
    name: 'purchaseSettlement',
    mixins: [search],
    components: {
        invoiceMultiple(resolve) {
            require(['components/basicComponents/global/dialog/invoiceMultiple/invoiceMultiple.vue'], resolve);
        }
    },
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
          docNo: '',
          flowStatus: '',
          projectName: '',
          settlementAgentUserName: '',
          settlementDateFrom: '',
          settlementDateTo: '',
          supplierName: '',
          contractName: ''
        },
        settlementRow: {}
      };
    },
    async created () {
      await this._getTableDataList();
    },
    methods: {
      // 获取表单
      _getTableDataList () {
        this.handleGetTableDataList('purchaseSettlement/getPageList');
      },
      handleRelationInvoice(row) {
        this.settlementRow = this.$clone(row);
        this.relationInvoice(row, 'contractId', row.settlementInvoiceRelations);
      },
      // 获取结算发票
      getSettlementInvoiceData(arr) {
        const settlementInvoiceRelations = [];
        for (const item of arr) {
            const index = this.settlementRow.settlementInvoiceRelations.findIndex(v => v.invoiceId === item.invoiceId);
            settlementInvoiceRelations.push({
              invoiceAmount: item.totalPriceTax,
              invoiceCode: item.invoiceCode,
              invoiceId: item.invoiceId,
              invoiceNo: item.invoiceNo,
              id: index >= 0 ? this.settlementRow.settlementInvoiceRelations[index].id : null,
              settlementId: this.settlementRow.id
            });
        }
        const data = {
          settlementInvoiceRelations,
          settlementId: this.settlementRow.id
        };
        this.$store.dispatch('purchaseSettlement/updateRelationInvoices', data).then(res => {
          if (res.status === 0) {
            this.$message.success(`${this.$t('button.relationInvoice')}${this.$t('tips.success')}!`);
            this.dialogSettlementInvoice = false;
            this._getTableDataList();
          } else {
            this.$message.error(`${this.$t('button.relationInvoice')}${this.$t('tips.fail')}!`);
          }
        });
      },
      // 删除
      handleDelete(row) {
        const statusConfig = {
          keyId: 'settlementId',
          keyName: 'projectName',
          row,
          api: 'purchaseSettlement/setDelete'
        };
        this.setDataDelete(statusConfig, row);
      },
      handleContractInfo(row, type = 'info') {
        const translateType = type;
        type = this.$base64.encode(type);
        const id = this.$base64.encode(row.contractId || 0);
        const routeName = row.sourceType === '01' ? 'purchaseContractLedger' : 'sporadicPurchase';
        const RouteTitleObj = { name: `${routeName}Edit`, loadRouteName: routeName, translateType };
        localStorage.setItem('RouteTitle', JSON.stringify(RouteTitleObj));
        this.$router.push(`/${routeName}Edit/${type}/${id}/${routeName}`);
      }
    }
  };
</script>

<style scoped lang="scss">
</style>
