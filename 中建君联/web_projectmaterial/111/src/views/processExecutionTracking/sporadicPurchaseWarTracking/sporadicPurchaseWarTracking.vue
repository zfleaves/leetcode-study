
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
      @searchEvent="searchEvent"
    >
      <template slot="mainOperateBtn">
        <div class="certificationTips">
          <!-- 此功能是对零星采购在材料入库中执行状态的管理，入库状态由零星采购申请单据明细与材料入库明细中数量的对比结果决定。 -->
            <div class="certificationTips-error">{{$t('sporadicPurchaseWarTracking.certificationTips')}}</div>
        </div>
      </template>
      <template slot="mainTable" slot-scope="config">
        <g-query-table :config="config.scope" @fnName="pageConfigEmitQueryTableButtonFnName"
         :getRowClassName="getRowClassNameMain">
          <template slot="expand" slot-scope="{scope}">
              <g-query-table
              style="margin-left: 40px;"
              :getRowClassName="getRowClassName"
              :config="{
                tableList: pageConfig.childrenMainTable.tableList,
                tableData: scope.row.sporadicPurchaseDetails
              }"
              @fnName="pageConfigEmitQueryTableButtonFnName">
              </g-query-table>
          </template>
          <!-- 入库状态 -->
          <template slot="table-incomingStatus" slot-scope="{row}">
            <div class="bestAuthStatus" :class="'bestAuthStatus'+row.incomingStatus">
              {{setDocName(row.incomingStatus)}}
            </div>
          </template>
          <template slot="table-buts-suffix" slot-scope="{ scope, item }">
            <template v-for="but in item.slotButs">
              <el-button
                :key="but.id"
                :class="but.class"
                :disabled="scope.row.incomingStatus === '04' || scope.row.incomingStatus === '03'"
                v-if="!but.noAuth ? authButtonList.indexOf(but.authCode) >= 0 : true"
                @click.stop.prevent="setFn(but, scope.row)"
                type="text"
                size="mini"
                v-fast-click
              >
                {{ $t(but.name) }}
              </el-button>
            </template>
          </template>
        </g-query-table>
      </template>
    </query-page>
    <!--关闭原因 -->
    <g-dialog v-if="closeDialogVisible" :dialogConfig="closeDialogConfig" :isVisible.sync="closeDialogVisible">
      <div class="content operationFormWrap" slot="body">
        <g-edit-form ref="projectForm" v-if="closeDialogVisible" type="add"
          :tableConfig="pageConfig.mainFormConfig" :projectForm="closeProjectForm">
        </g-edit-form>
      </div>
      <div slot="footer" class="footer">
        <el-button class="urgent" type="primary" icon="el-icon-circle-close" size="small" @click="closeDialogVisible = false">
          {{$t('button.close')}}
        </el-button>
        <el-button size="small" type="primary" icon="el-icon-circle-check" @click="drawerItemSave" v-fast-click>
          {{$t('button.save')}}
        </el-button>
      </div>
    </g-dialog>
  </div>
</template>

<script>
import Page from './config.js';
import { search } from 'mixins/searchMixins';

export default {
  name: 'sporadicPurchaseWarTracking',
  mixins: [search],
  data() {
    return {
      // 查询页面基础参数
      page: new Page(),
      pageConfig: {},
      loading: false,
      // =====================
      tableSeleList: [],
      // 搜索数据
      searchData: {
            applyDateFrom: '',
            applyDateTo: '',
            applyUserName: '',
            createByName: '',
            docNo: '',
            projectId: '',
            projectName: '',
            purchaseContent: '',
            orgName: '',
            sporadicPurchaseReason: '',
            flowStatus: ['02'],
            incomingStatus: []
      },
      sporadicPurchaseStatusList: [
        // 1，未入库；2，部分入库；3，已完成；4，手动关闭。
        { dataCode: '01', dataName: 'sporadicPurchaseWarTracking.sporadicPurchaseStatus01' },
        { dataCode: '02', dataName: 'sporadicPurchaseWarTracking.sporadicPurchaseStatus02' },
        { dataCode: '03', dataName: 'sporadicPurchaseWarTracking.sporadicPurchaseStatus03' },
        { dataCode: '04', dataName: 'sporadicPurchaseWarTracking.sporadicPurchaseStatus04' }
      ],
      // 关闭原因
      closeDialogVisible: false,
      closeDialogConfig: {
        title: this.$t('dialog.closeReason'),
        appendBody: false,
        center: true,
        top: '150px',
        width: '40%',
        span: '0.3'
      },
      closeProjectForm: {
        incomingCloseReason: ''
      },
      rowInformation: {}
    };
  },
  async created() {
    this.pageSize = 10;
    await this._getTableDataList();
  },
  methods: {
    // 获取表单
    _getTableDataList() {
      this.handleGetTableDataList('sporadicPurchaseWarTracking/getPageList');
    },
    // 增、改、查 路由跳转设置
    handleInfo(row, type = 'info') {
      const routeName = 'sporadicPurchase';
      const translateType = type;
      type = this.$base64.encode(type);
      const id = this.$base64.encode(row.id || 0);
      const orderSource = this.$base64.encode('sporadicPurchase');
      const orderSourceId = this.$base64.encode(0);
      const RouteTitleObj = { name: `${routeName}Edit`, loadRouteName: routeName, translateType };
      localStorage.setItem('RouteTitle', JSON.stringify(RouteTitleObj));
      this.$router.push(`/${routeName}Edit/${type}/${id}/${routeName}/${orderSourceId}/${orderSource}`);
    },
    setFn(btnParameter, row) {
      this[btnParameter.fn](row);
    },
    // 下单状态
    setDocName(code) {
      const index = this.sporadicPurchaseStatusList.findIndex(v => v.dataCode === code);
      if (index >= 0) {
        return this.$t(this.sporadicPurchaseStatusList[index].dataName);
      } else {
        return '';
      }
    },
    // 保存关闭原因弹窗
    drawerItemSave() {
      this.$refs.projectForm.getValidateForm(() => {
        const loading = this.getLoading();
        const params = {
          sporadicPurchaseId: this.rowInformation.id,
          incomingStatus: '04',
          incomingCloseReason: this.closeProjectForm.incomingCloseReason
        };
        this.closeDialogVisible = false;
        this.$store.dispatch('sporadicPurchaseWarTracking/updateOrderStatus', params).then(res => {
          if (res.status === 0) {
            this._getTableDataList();
          } else {
            this.$message.error(`${this.$t(`exception.${res.errorCode}`)}`);
          }
          loading.close();
        }).catch(e => {
          loading.close();
        });
      });
    },

    // 手动关闭
    sysHandleForceUpdate(row) {
    // 手动关闭后入库状态会被更改，并且在材料入库中无法再选择此采购单。您确定要关闭吗?
      this.closeDialogVisible = true;
      this.rowInformation = this.$clone(row);
      this.closeProjectForm.closeReason = '';
    },
    getRowClassNameMain({row}) {
      for (const item of row.sporadicPurchaseDetails) {
        if ((item.incomingQuantity || 0) > (item.currentApplyQuantity || 0)) {
          this.$set(row, 'isError', true);
        }
      }
      return row.isError > 0 ? 'error-active' : '';
    },
    getRowClassName({row}) {
      if ((row.incomingQuantity || 0) > (row.currentApplyQuantity || 0)) {
        return 'error-active';
      } else {
        return '';
      }
    },
    // 快速入库
    sysHandleQuickInWarehouse(row, type = 'add') {
      if (row.flowStatus !== '02') {
        // 流程审批完成后才可快速入库
        this.$message.error(this.$t('sporadicPurchaseWarTracking.flowStatusDelivery'));
        return;
      }
      if (row.id) {
        if (!this.judgeSamePerson(row)) {
          this.editError(this.$t('sporadicPurchaseWarTracking.quickInWarehouse'));
          return;
        }
      }
      // 此单据已经办理过快速入库，确定要再次入库吗？
      // 快速入库会跳转到材料入库页面，您确定要跳转吗
      const message = `${this.$t('sporadicPurchaseWarTracking.quickInWarehouseTips')}？<br>
      <span style="color:red">${row.ifFastIncoming ? this.$t('sporadicPurchaseWarTracking.quickInWarehouseTips1') : ''}</span>`;
      this.$confirm(message, this.$t('sporadicPurchaseWarTracking.quickInWarehouse'), {
        confirmButtonText: this.$t('button.determine'),
        cancelButtonText: this.$t('button.close'),
        dangerouslyUseHTMLString: true,
        type: 'warning'
      })
      .then(() => {
        this.toInWarehouse(row, type);
      })
      .catch(() => {});
    },
    toInWarehouse(row, type) {
        const translateType = type;
        type = this.$base64.encode(type);
        const checkArrivalId = this.$base64.encode(row.id);
        const id = this.$base64.encode(row.id || 0);
        const routeName = 'warIncoming';
        const RouteTitleObj = {name: `${routeName}Edit`, loadRouteName: routeName, translateType};
        localStorage.setItem('RouteTitle', JSON.stringify(RouteTitleObj));
        this.$router.push(`/${routeName}Edit/${type}/${id}/sporadicPurchase/${checkArrivalId}/${routeName}`);
    }
  }
};
</script>

<style scoped lang="scss">
.instructionsForUse {
  p {
    padding: 10px 0;
  }
}
.bestAuthStatus {
  font-size: 14px;
  width: 100%;
  max-width: 100px;
  line-height: 20px;
  padding: 2px 0;
  text-align: center;
  &.bestAuthStatus02 {
    color: #f55e14;
    background-color: rgba(245,94,20, 0.2);
  }
  &.bestAuthStatus04 {
    color: #2b74ec;
    background-color: rgba(43,116,236, 0.2);
  }
  &.bestAuthStatus03 {
    color: #24b568;
    background-color: rgba(36,181,104, 0.2);
  }
  &.bestAuthStatus01 {
    color: #f73535;
    background-color: rgba(247,53,53, 0.2);
  }
}
.slot_btn{
  width: 100%;
}
.certificationTips {
    display: inline-block;
    position: absolute;
    left: 0px;
    bottom: 0;
    text-align: left;
    .certificationTips-error{
      color: #f73535;
      font-size: 12px;
    }
}
</style>
