<!--
 * @Author: your name
 * @Date: 2021-10-25 14:13:20
 * @LastEditTime: 2021-12-20 10:13:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial-项目材料管理\src\views\basic\sporadicPurchaseGuration\sporadicPurchaseGuration.vue
-->
<template>
  <div>
    <query-page
        :page-config="pageConfig"
        :loading.sync="loading"
        :tableSeleList.sync="tableSeleList"
        @searchData="getSearchData"
        @fnName="pageConfigBtnFnName"
        @resetTableConfigList="pageConfigResetTableConfigList"
        @onRefresh="pageConfigOnRefresh"
        @pages="pageConfigPages"
        @searchEvent="searchEvent">
        <template slot="mainOperateBtnTips">
          <el-tooltip placement="top-start">
            <div slot="content" class="tips-popper">
              <div>{{$t('sporadicPurchaseGuration.explainTips1')}}</div>
              <div>{{$t('sporadicPurchaseGuration.explainTips2')}}</div>
              <div>{{$t('sporadicPurchaseGuration.explainTips3')}}</div>
            </div>
            <!-- 说明？ -->
            <span class="tips">{{$t('tips.explainTips')}}<i class="el-icon-question"></i></span>
          </el-tooltip>
        </template>
        <template slot="mainTable" slot-scope="config">
          <g-query-table
            :config="config.scope"
            :tableList.sync="tableSeleList"
            @fnName="pageConfigEmitQueryTableButtonFnName">
          </g-query-table>
        </template>
    </query-page>

    <g-drawer :title="title"
      v-if="pageConfigLoading" :display.sync="pageConfigLoading" :inner="true" width="35%">
      <div slot="body">
          <div class="operationFormWrap">
            <el-form ref="projectForm" label-position="left" :model="projectForm" :rules="rules"
              label-width="120px" class="demo-ruleForm">
              <el-form-item :label="$t('fConfig.projectName')" prop="projectName" :title="$t('fConfig.projectName')" v-if="!isBatch">
                <el-input v-model="projectForm.projectName" disabled size="small">
                </el-input>
              </el-form-item>
              <el-form-item :label="$t('sporadicPurchaseGuration.purchaseQuota')" prop="purchaseQuota"
                :title="$t('sporadicPurchaseGuration.purchaseQuota')">
                <el-number v-model="projectForm.purchaseQuota"
                  size="small" clearable :maxlength="Number(12)" :precision="2" :min="0" :max="99999999999" show-word-limit>
                </el-number>
              </el-form-item>
            </el-form>
          </div>
      </div>
      <div slot="but">
        <el-button class="urgent" type="primary" icon="el-icon-circle-close" size="small" @click="pageConfigLoading = false">
          {{$t('button.close')}}
        </el-button>
        <el-button size="small" type="primary" icon="el-icon-circle-check"
                   @click="handleSave" v-fast-click>
          {{$t('button.save')}}
        </el-button>
      </div>
    </g-drawer>
  </div>
</template>

<script>
  import Page from './config.js';
  import {search} from 'mixins/searchMixins';

  export default {
    name: 'sporadicPurchaseGuration',
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
        authButtonList: [],
        searchData: {
          projectName: ''
        },
        title: '',
        pageConfigLoading: false,
        isBatch: false,
        projectForm: {
          purchaseQuota: '',
          projectId: '',
          projectName: ''
        },
        rules: {}
      };
    },
    async created () {
      this.authButtonList = this.$route.meta.authButtonList && this.$route.meta.authButtonList.map(v => v.resUrl);
      await this._getTableDataList();
    },
    methods: {
      // 获取表单
      _getTableDataList () {
        this.loading = true;
        const data = {
            pageNo: this.pageNo,
            pageSize: this.pageSize,
            ...this.pageConfig.searchControls.searchData
        };
        this.$store.dispatch('sporadicPurchaseGuration/getPageList', data).then(res => {
            if (res.status === 0) {
            this.pageConfig.mainTable.tableData = res.results.records;
            this.pageConfig.mainTable.total = res.results.total;
          } else {
            this.$message.error(this.$t(`exception.${res.errorCode}`));
          }
          this.loading = false;
        }).catch(e => {
          this.loading = false;
        });
      },
      handleSetMoney(row) {
        this.projectForm.purchaseQuota = row.purchaseQuota;
        this.projectForm.projectId = row.id;
        this.projectForm.projectName = row.projectName;
        this.title = this.$t('sporadicPurchaseGuration.set');
        this.isBatch = false;
        this.pageConfigLoading = true;
      },
      // 批量设置
      handleBatchSet() {
        if (this.tableSeleList.length === 0) {
          // 请选择所选数据
          this.$message.error('sporadicPurchaseGuration.batchSetData');
          return;
        }
        this.projectForm.purchaseQuota = '';
        this.title = this.$t('sporadicPurchaseGuration.batchSet');
        this.isBatch = true;
        this.pageConfigLoading = true;
      },
      handleSave() {
        let data = {};
        let saveFunUrl = '';
        const purchaseQuota = this.projectForm.purchaseQuota === '' ? null : this.projectForm.purchaseQuota;
        if (this.isBatch) {
          data = {
            orgId: this.$utils.Auth.hasUserInfo().orgId,
            parentSubOrgId: this.$utils.Auth.hasUserInfo().parentSubOrgId,
            projectIds: this.tableSeleList.map(v => v.id),
            purchaseQuota: this.projectForm.purchaseQuota || null,
            tenantId: this.$utils.Auth.hasUserInfo().tenantId
          };
          saveFunUrl = 'sporadicPurchaseGuration/setBatchEdit';
        } else {
          data = {
            orgId: this.$utils.Auth.hasUserInfo().orgId,
            parentSubOrgId: this.$utils.Auth.hasUserInfo().parentSubOrgId,
            projectId: this.projectForm.projectId,
            purchaseQuota,
            tenantId: this.$utils.Auth.hasUserInfo().tenantId
          };
          saveFunUrl = 'sporadicPurchaseGuration/setEdit';
        }
        this.$store.dispatch(saveFunUrl, data).then(res => {
          if (res.status === 0) {
            this.$message.success(`${this.title} ${this.$t('tips.success')}!`);
            this._getTableDataList();
          } else {
            this.$message.error(this.$t(`exception.${res.errorCode}`));
          }
          this.pageConfigLoading = false;
        });
      }
    }
  };
</script>

<style scoped lang="scss">
.tips{
  position: absolute;
  left: 0;
  font-size: 14px;
  line-height: 36px;
  color: #248bfe;
}
.tips-popper{
  line-height: 30px;
}
</style>
