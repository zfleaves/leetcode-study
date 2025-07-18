
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
    name: 'proProject',
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
          beginTimeFrom: '',
          beginTimeTo: '',
          belongCompanyId: '',
          projectName: '',
          belongCompanyName: '',
          projectStatus: ['1'],
          projectTypeCodes: [],
          projectTypeCode: [],
          projectManagerUserName: ''
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
        }
    },
    async created () {
      // await this._getTableDataList();
      let id = '';
      if (this.selectInfo.projectSource === '02' && this.selectInfo.id) {
          id = this.selectInfo.id;
      }
      this.pageConfig.mainTable.selectedList = id ? [{id}] : [];
    },
    methods: {
      // 获取表单
      _getTableDataList () {
        this.handleGetTableDataList('proProjectResearch/getProjectPage');
      },
      getTableList(arr) {
        if (arr && arr.length) {
            const row = arr[0];
            this.$set(row, 'projectSource', '02');
            this.$emit('getSelect', row);
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
