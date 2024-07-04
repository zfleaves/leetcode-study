<!--
 * @Author: your name
 * @Date: 2021-06-15 10:30:19
 * @LastEditTime: 2021-06-15 10:52:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_project-项目前期管理\src\views\projectManage\components\contract\contract.vue
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
    name: 'contract',
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
            classifyPropertyType: '',
            classifyPropertyTypes: ['LWHT', 'ZYFBHT'],
            contractCode: '',
            contractName: '',
            contractNatureCode: '02',
            partyBUnitName: '',
            projectId: '',
            projectName: '',
            signUserName: '',
            signTimeFrom: '',
            signTimeTo: ''
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
            default: ''
        },
        projectName: {
            default: ''
        },
        getTableListApi: {
            type: String,
            default: 'publicApi/getV1ContractExpendClassifyPage'
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
        this.pageConfig.searchControls.searchData.projectName = this.$clone(this.projectName);
        this.handleGetTableDataList(this.getTableListApi);
      },
      // 根据url获取数据
      handleGetTableDataList(url, paging = false, callBack) {
        this.loading = true;
        const data = {
            pageNo: this.pageNo,
            pageSize: this.pageSize,
            ...this.pageConfig.searchControls.searchData
        };
        this.$store.dispatch(url, data).then(res => {
          if (res.status === 0) {
            for (const item of res.results) {
                item.projectName = item.proProjectInfoDtos.length ? item.proProjectInfoDtos.map(v => v.projectName).join(',') : '';
            }
            this.pageConfig.mainTable.tableData = res.results.filter(v => v.executionStatus !== '03');
            console.log(this.pageConfig.mainTable.tableData);
            this.pageConfig.mainTable.total = res.results.total;
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
