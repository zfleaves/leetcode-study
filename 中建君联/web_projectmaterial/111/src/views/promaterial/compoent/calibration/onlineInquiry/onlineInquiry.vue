<!--
 * @Author: wumaoxia 1805428335@qq.com
 * @Date: 2022-07-18 10:28:28
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @LastEditTime: 2022-12-09 16:41:38
 * @FilePath: \web_contract\src\views\contractExpend\components\calibration\onlineInquiry\onlineInquiry.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

<template>
  <div style="height: 100%;">
    <query-page
        res="sysQueryPage"
        :page-config="pageConfig"
        :loading.sync="loading"
        :dialogHeight="dialogHeight - 90"
        :tableSeleList.sync="tableSeleList"
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
            @tableList="getTableList"
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
    name: 'onlineInquiry',
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
            bidBasis: '',
            bidDateFrom: '',
            bidDateTo: '',
            bidSupplierId: '',
            bidSupplierName: '',
            createTimeFrom: '',
            createTimeTo: '',
            docNo: '',
            flowStatus: ['02'],
            inquireBatchNo: '',
            inquireContent: '',
            inquireDutyUserName: '',
            inquireTitle: '',
            inquireType: '',
            projectId: '',
            projectName: '',
            purchaseAgentName: ''
        }
      };
    },
    props: {
        dialogHeight: {
            type: Number,
            default: 300
        },
        selectInfo: {
            type: Object,
            default: () => {}
        },
        projectId: {
            default: ''
        }
    },
    async created () {
        await this._getTableDataList();
        let id = '';
        if (this.selectInfo.inquirySourceType === '01' && this.selectInfo.id) {
            id = this.selectInfo.id;
        }
        this.pageConfig.mainTable.selectedList = id ? [{id}] : [];
    },
    methods: {
      // 获取表单
      _getTableDataList () {
        // this.pageConfig.searchControls.searchData.projectId = this.projectId;
        this.handleGetTableDataList('supplyOrder/getInquiryReportContractPage');
      },
      handleInfo(row, type = 'info') {
        type = this.$base64.encode(type);
        const id = this.$base64.encode(row.id || 0);
        const routeName = 'biddingConfirm';
        const url = `${this.$utils.config.jumpUrl}/inquire/#/${routeName}Edit/${type}/${id}/${routeName}`;
        window.open(url, '_blank');
      },
      getTableList(arr) {
        if (arr && arr.length) {
            const row = arr[0];
            this.$emit('getSelect', {
                inquiryDocNo: row.docNo,
                id: row.id,
                inquirySourceType: '01',
                inquiryTitle: row.inquireTitle
            });
        } else {
            this.$emit('getSelect', {});
        }
      }
    }
  };
</script>
<style lang='scss' scoped>
/deep/ .table_cons_table{
    height: calc(100% - 40px);
}
</style>
