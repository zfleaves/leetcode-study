<!--
 * @Author: your name
 * @Date: 2021-02-02 16:00:29
 * @LastEditTime: 2022-03-03 16:35:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\views\demMaster\demMasterExecute\demMasterExecute.vue
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
            <template slot="table-progressEstimate" slot-scope="{row, item}">
                <span class="progressEstimate" :class="'progressEstimate'+row[item.prop]">
                    {{setDicData(row[item.prop])}}
                </span>
            </template>
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
    name: 'demMasterExecute',
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
            createByName: '',
            realEndDateFrom: '',
            realEndDateTo: '',
            progressEstimate: '',
            projectName: '',
            projectStatus: []
        },
        workHours: 8
      };
    },
    async created () {
      await this._getTableDataList();
    },
    methods: {
      // 获取表单
        _getTableDataList () {
            this.handleGetTableDataList('demMasterPlan/getPageExecuteList');
        },
        handleGetTableDataList(url, paging = true, callBack) {
            this.loading = true;
            const data = {
                pageNo: this.pageNo,
                pageSize: this.pageSize,
                ...this.pageConfig.searchControls.searchData
            };
            this.$store.dispatch(url, data).then(async res => {
                if (res.status === 0) {
                  for (const item of res.results) {
                    const timeRes = await this.$store.dispatch('projectCalendar/getWorktimeInfo', {projectId: item.projectId}).then();
                    this.workHours = timeRes.results.workHours || 8;
                    const day = item.planDuration / this.workHours;
                    item.planDuration = Number(day.toFixed(1));
                    // const realDay = item.realDuration / this.workHours;
                    // item.realDuration = Number(realDay.toFixed(1));
                    const progress = item.progress * 100;
                    item.progress = Number(progress.toFixed(4));
                  }
                    this.pageConfig.mainTable.tableData = res.results ? res.results : [];
                    callBack && callBack();
                } else {
                    this.$message.error(this.$t(`exception.${res.errorCode}`));
                }
                this.loading = false;
            }).catch(e => {
                this.loading = false;
            });
        },
        // 表格数据字典
        setDicData (value) {
            const selectList = [
                { dataName: 'demMasterExecute.progressEstimate0', dataCode: 0 },
                { dataName: 'demMasterExecute.progressEstimate1', dataCode: 1 },
                { dataName: 'demMasterExecute.progressEstimate2', dataCode: 2 }
            ];
            const index = selectList && selectList.findIndex(v => v.dataCode === value);
            if (index < 0) return '';
            return this.$t(selectList[index].dataName);
        },
        // 编辑计划
        handleEditPlan(row) {
            console.log(row, 'row');
            const type = this.$base64.encode('info');
            const id = this.$base64.encode(row.id || 0);
            this.$router.push(`/ganttPage/${type}/${id}/${this.$route.name}`);
        }
    }
  };
</script>

<style scoped lang="scss">
.progressEstimate{
    font-size: 14px;
    width: 100%;
    padding: 2px 10px;
    &.progressEstimate0 {
        color: #f73535;
        background-color: rgba(247,53,53, 0.2);
    }
    &.progressEstimate1 {
        color: #2b74ec;
        background-color: rgba(43,116,236, 0.2);
    }
    &.progressEstimate2 {
        color: #24b568;
        background-color: rgba(36,181,104, 0.2);
    }
}
</style>
