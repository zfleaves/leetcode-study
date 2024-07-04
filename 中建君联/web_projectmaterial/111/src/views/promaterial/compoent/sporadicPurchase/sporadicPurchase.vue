<!--
 * @Author: your name
 * @Date: 2020-08-03 16:31:41
 * @LastEditTime: 2021-12-30 11:19:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\compoent\sporadicPurchase\sporadicPurchase.vue
-->
<template>
  <div style="height: 100%;">
    <query-page
        res="sysQueryPage"
        :page-config="pageConfig"
        :loading.sync="loading"
        :tableSeleList.sync="tableSeleList"
        :dialogHeight="dialogHeight"
        @searchData="getSearchData"
        @fnName="pageConfigBtnFnName"
        @resetTableConfigList="pageConfigResetTableConfigList"
        @onRefresh="pageConfigOnRefresh"
        @pages="pageConfigPages"
        @dialogEvent="dialogEvent"
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

  export default {
    name: 'sporadicPurchase',
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
          docNo: '',
          flowStatus: ['02'],
          projectId: 0,
          projectName: '',
          applyUserName: '',
          applyDateFrom: '',
          applyDateTo: '',
          sporadicPurchaseReason: '',
          sporadicPurchaseStatus: ['01', '02']
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
        // 选中的零星采购单
        selectId: {
            default: []
        },
        projectId: {
            default: 0
        }
    },
    methods: {
      // 获取表单
      _getTableDataList () {
        this.pageConfig.searchControls.searchData.projectId = this.projectId;
        this.pageConfig.mainTable.selectedList = this.selectId;
        this.handleGetTableDataList('sporadicReimburse/getSporadicPurchaseList', false, () => {
          this.pageConfig.mainTable.tableData.forEach(item => {
            this.$set(item, 'purchaseApplyId', item.id);
            this.$set(item, 'purchaseApplyName', item.sporadicPurchaseReason);
            this.$set(item, 'purchaseApplyCode', item.docNo);
          });
        });
      }
    }
  };
</script>

<style scoped lang="scss">
</style>
