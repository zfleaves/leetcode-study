<!--
 * @Author: your name
 * @Date: 2021-08-27 11:22:03
 * @LastEditTime: 2021-09-07 17:09:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \project_web\src\views\procurementImplementation\components\sourcingResults\sourcingResults.vue
-->


<template>
  <div style="height: 100%;">
    <query-page
        res="sysQueryPage"
        :page-config="pageConfig"
        :loading.sync="loading"
        :tableSeleList.sync="tableSeleList"
        :dialogHeight="dialogHeight - 10"
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
import { search } from 'mixins/searchMixins';

export default {
  name: 'sourcingResults',
  mixins: [search],
  components: {},
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
        expendContractId: '',
        incomingId: null,
        projectId: null,
        queryParam: '',
        sourceType: ''
      }
    };
  },
  async created () {
    await this._getTableDataList();
  },
  mounted () { },
  props: {
    selectedList: {
      type: Array,
      default: () => []
    },
    dialogHeight: {
        type: Number,
        default: 280
    },
    projectId: {
      type: Number,
      default: 0
    },
    selectId: {
      type: Number,
      default: 0
    },
    sourceType: {
      type: String,
      default: ''
    },
    expendContractId: {
      type: Number,
      default: 0
    }
  },
  methods: {
    // 获取表单
    _getTableDataList () {
      this.pageConfig.mainTable.selectedList = [{ id: this.selectId }];
      this.pageConfig.searchControls.searchData.projectId = this.projectId;
      this.pageConfig.searchControls.searchData.sourceType = this.sourceType;
      this.pageConfig.searchControls.searchData.expendContractId = this.expendContractId;
      this.handleGetTableDataList('warIncoming/getIncomingRetrungoodsDetails', false);
    }
  }
};
</script>

<style scoped lang="scss">
</style>

