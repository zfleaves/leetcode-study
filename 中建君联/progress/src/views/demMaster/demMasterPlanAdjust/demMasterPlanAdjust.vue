<!--
 * @Author: your name
 * @Date: 2021-01-28 09:03:51
 * @LastEditTime: 2021-01-29 15:36:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\views\demMaster\demMasterPlanAdjust\demMasterPlanAdjust.vue
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
  </div>
</template>

<script>
  import Page from './config.js';
  import {search} from 'mixins/searchMixins';
  import Auth from 'util/auth';

  export default {
    name: 'demMasterPlanAdjust',
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
          'createByName': '',
          'flowStatus': [],
          'createTimeFrom': '',
          'createTimeTo': '',
          'projectName': ''
        }
      };
    },
    async created () {
      const a = '-';
      console.log(a.split('-'));
      await this._getTableDataList();
    },
    methods: {
      // 获取表单
        _getTableDataList () {
            this.handleGetTableDataList('demMasterPlanAdjust/getPageList');
        },
        handleGetTableDataList(url, paging = true, callBack) {
            this.loading = true;
            const data = {
                pageNo: this.pageNo,
                pageSize: this.pageSize,
                ...this.pageConfig.searchControls.searchData
            };
            this.$store.dispatch(url, data).then(res => {
                if (res.status === 0) {
                if (paging) {
                    for (const item of res.results.records) {
                        item.beforeVersionNumber = `V${item.beforeVersionNumber}.0`;
                    }
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
        },
        // 查询版本历史
        handleVersionNumberInfo(row) {

        },
        // 编辑计划
        handleEditPlan(row) {
            console.log(row, 'row');
            const type = this.$base64.encode('edit');
            const id = this.$base64.encode(row.id || 0);
            this.$router.push(`/ganttPage/${type}/${id}/${this.$route.name}`);
        },
        // 删除
        handleDelete(row) {
            const statusConfig = {
                keyId: 'masterPlanAdjustId',
                keyName: 'projectName',
                row,
                api: 'demMasterPlanAdjust/setDelete'
            };
            this.setDataDelete(statusConfig, row);
        }
    }
  };
</script>

<style scoped lang="scss">
</style>
