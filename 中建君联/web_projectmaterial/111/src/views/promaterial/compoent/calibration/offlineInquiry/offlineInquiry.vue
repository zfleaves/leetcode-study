
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
    name: 'offlineInquiry',
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
            calibraTimeFrom: '',
            calibraTimeTo: '',
            createByName: '',
            flowStatus: ['02'],
            inquiryDescription: '',
            projectName: '',
            purchaseOperatorName: ''
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
      if (this.selectInfo.inquirySourceType === '02' && this.selectInfo.id) {
          id = this.selectInfo.id;
      }
      this.pageConfig.mainTable.selectedList = id ? [{id}] : [];
    },
    methods: {
      // 获取表单
      _getTableDataList () {
        // this.pageConfig.searchControls.searchData.projectId = this.projectId;
        this.handleGetTableDataList('supplyOrder/getInquiryCalibraContractPage');
      },
      handleInfo(row, type = 'info') {
        type = this.$base64.encode(type);
        const id = this.$base64.encode(row.id || 0);
        const routeName = 'inquiryAndCalibrationRegistration';
        const url = `${this.$utils.config.jumpUrl}/inquire/#/${routeName}Edit/${type}/${id}/${routeName}`;
        window.open(url, '_blank');
      },
      getTableList(arr) {
        if (arr && arr.length) {
            const row = arr[0];
            this.$emit('getSelect', {
                inquiryDocNo: row.docNo,
                id: row.id,
                inquirySourceType: '02',
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
