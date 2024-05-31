<!--
 * @Author: your name
 * @Date: 2021-01-26 17:35:39
 * @LastEditTime: 2021-03-01 17:28:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\views\demMaster\demMasterPlan\demMasterPlan.vue
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

    <!-- 选择收入合同汇总 -->
    <g-dialog v-if="historyFlag" :dialogConfig="historyDialogConfig" :isVisible.sync="historyFlag">
      <template slot="body" slot-scope="{height}">
        <el-table :data="historyData" :height="height" :max-height="height">
          <template slot="empty">
            <no-data>
            </no-data>
          </template>
          <el-table-column align="center" type="index" :label="$t('fConfig.serialNumber')" width="60">
          </el-table-column>
          <el-table-column align="center" width="100" :label="$t('demMasterPlan.versionNumber')">
              <template slot-scope="scope">
                  V{{scope.row.versionNumber}}.0
              </template>
          </el-table-column>
          <el-table-column align="center"  :label="$t('demMasterPlan.createTime')">
              <template slot-scope="scope">
                  {{scope.row.createTime | setDate}}
              </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('demMasterPlan.versionSource')">
              <template slot-scope="scope">
                  {{scope.row.versionNumber > 1 ? $t('demMasterPlan.versionSource1') : $t('demMasterPlan.versionSource1')}}
              </template>
          </el-table-column>
          <el-table-column align="center" prop="createByName" :label="$t('demMasterPlan.createByName')">
          </el-table-column>
          <el-table-column width="120" prop="calendarValue" :label="$t('fConfig.operate')">
            <template  slot-scope="scope">
                <span class="midFont set" @click="handleVersionNumber(scope.row)">{{$t('demMasterPlan.info')}}</span>
              </template>
          </el-table-column>
      </el-table>
      </template>
    </g-dialog>
  </div>
</template>

<script>
  import Page from './config.js';
  import {search} from 'mixins/searchMixins';
  import Auth from 'util/auth';

  export default {
    name: 'demMasterPlan',
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
        },
        historyData: [],
        historyFlag: false,
        historyDialogConfig: {
          title: this.$t('demMasterPlan.selectHistory'),
          appendBody: false,
          center: true,
          top: '80px',
          width: '80%',
          span: '0.7'
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
            this.handleGetTableDataList('demMasterPlan/getPageList');
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
                      item.versionNumber = `V${item.versionNumber}.0`;
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
          if (row.versionNumber === 'V1.0') {
            // 当前版本未进行主计划调整，无历史版本。
            this.$message.info(this.$t('demMasterPlan.versionNumberTips'));
            return;
          }
          const data = {
            'createTimeFrom': '',
            'createTimeTo': '',
            'masterPlanId': row.id,
            'pageNo': 1,
            'pageSize': 10000,
            'projectId': row.projectId,
            'projectName': row.projectName
          };
          this.$store.dispatch('demMasterPlan/getPageHistoryList', data).then(res => {
              if (res.status === 0) {
                this.historyData = res.results ? res.results.records : [];
              } else {
                this.$message.error(this.$t(`exception.${res.errorCode}`));
              }
              this.loading = false;
          }).catch(e => {
              this.loading = false;
          });
          this.historyFlag = true;
        },
        // 查看历史版本
        handleVersionNumber(row) {
          const type = this.$base64.encode('info');
          const id = this.$base64.encode(row.id || 0);
          this.$router.push(`/ganttPage/${type}/${id}/history`);
          this.historyFlag = false;
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
                keyId: 'masterPlanId',
                keyName: 'projectName',
                row,
                api: 'demMasterPlan/setDelete'
            };
            this.setDataDelete(statusConfig, row);
        }
    }
  };
</script>

<style scoped lang="scss">
</style>
