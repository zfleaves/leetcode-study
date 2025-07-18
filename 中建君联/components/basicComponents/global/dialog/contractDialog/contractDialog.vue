<!--
 * @Author: your name
 * @Date: 2020-07-25 09:19:03
 * @LastEditTime: 2021-05-20 11:44:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\components\basicComponents\global\dialog\contractIncomeDialog\contractIncomeDialog.vue
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
  import Auth from 'util/auth';

  export default {
    name: 'contractIncomeDialog',
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
        // 搜索数据
        searchData: {
          contractCode: '',
          contractName: '',
          contractTypeCodes: [],
          flowStatus: ['02'],
          partyBName: '',
          performanceStatus: [], // 履约状态(01新签订 02履约中 03已终止 04已履毕)
          projectId: '',
          signDateFrom: '',
          signDateTo: ''
        },
        dialogVisible: false
      };
    },
    props: {
      dialogHeight: {
        type: Number,
        default: 300
      },
      // 选中的单位
      selectId: {
        default: 0
      },
      getTableListApi: {
        type: String,
        default: 'contractRegistration/getPageList'
      },
      contractTypeCodes: {
        type: Array,
        default: () => {}
      }
    },
    async created () {
      this.$set(this.pageConfig.searchControls.searchData, 'contractTypeCodes', this.contractTypeCodes);
      await this._getTableDataList();
      this.pageConfig.mainTable.selectedList = [{id: this.selectId}];
    },
    methods: {
      // 获取表单
      _getTableDataList () {
        this.handleGetTableDataList(this.getTableListApi);
      }
    }
  };
</script>

<style scoped lang="scss">
</style>
