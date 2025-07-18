<!--
 * @Author: your name
 * @Date: 2020-08-20 16:57:35
 * @LastEditTime: 2020-08-20 17:30:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectsubcontract-项目分包云\src\components\basicComponents\global\dialog\subcontractDialog\subcontractDialog.vue
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
    name: 'subcontractDialog',
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
            subcontractContent: '',
            partyBName: '',
            projectId: '',
            subContractEndTimeEnd: '',
            subContractEndTimeStart: '',
            subContractStartTimeEnd: '',
            subContractStartTimeStart: ''
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
        projectId: {
            default: 0
        },
        getTableListApi: {
            type: String,
            default: 'publicApi/getSubcontractPage'
        }
    },
    async created () {
      await this._getTableDataList();
      this.pageConfig.mainTable.selectedList = [{id: this.selectId}];
    },
    methods: {
        // 获取表单
        _getTableDataList () {
            this.pageConfig.searchControls.searchData.projectId = this.$clone(this.projectId);
            this.handleGetTableDataList(this.getTableListApi, true);
        },
       // 根据url获取数据
        handleGetTableDataList(url, paging = true, callBack) {
            this.loading = true;
            const data = {
                pageNo: this.pageNo,
                pageSize: this.pageSize,
                ...this.pageConfig.searchControls.searchData
            };
            this.$store.dispatch(url, data).then(res => {
                if (res.status === 0) {
                    // console.log(res.results);
                  if (paging) {
                    this.pageConfig.mainTable.tableData = res.results ? res.results.records : [];
                    this.pageConfig.mainTable.total = res.results ? res.results.total : 0;
                  } else {
                    this.pageConfig.mainTable.tableData = res.results ? res.results : [];
                  }
                callBack && callBack();
                } else {
                this.$message.error(this.$t(`exception.${res.errorCode}`));
                }
                this.loading = false;
            }).catch(e => {
                this.loading = false;
            });
        }
    }
  };
</script>

<style scoped lang="scss">
</style>
