
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
            <!-- 此功能是对零星采购在零星采购报销中执行状态的管理，默认报销状态由零星采购单据明细与采购报销明细中数量的对比结果决定。 -->
              <div class="certificationTips-error">{{$t('sporadicPurchaseTracking.certificationTips')}}</div>
          </div>
      </template>
      <template slot="mainTable" slot-scope="config">
        <!-- 下单状态 -->
        <g-query-table :config="config.scope"
         @fnName="pageConfigEmitQueryTableButtonFnName"
          :getRowClassName="getRowClassNameMain"
         >
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
          <template slot="table-sporadicPurchaseStatus" slot-scope="{row}">
            <div class="bestAuthStatus" :class="'bestAuthStatus'+row.sporadicPurchaseStatus">
              {{setDocName(row.sporadicPurchaseStatus)}}
            </div>
          </template>
          <template slot="table-buts-suffix" slot-scope="{ scope, item }">
            <template v-for="but in item.slotButs">
              <el-button
                :key="but.id"
                :class="but.class"
                :disabled="scope.row.sporadicPurchaseStatus === '04' || scope.row.sporadicPurchaseStatus === '03'"
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
import Auth from 'util/auth';

export default {
  name: 'sporadicPurchaseTracking',
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
            orgName: '',
            sporadicPurchaseReason: '',
            sporadicPurchaseStatus: []
      },
      sporadicPurchaseStatusList: [
        { dataCode: '01', dataName: '未报销' },
        { dataCode: '02', dataName: '部分报销' },
        { dataCode: '03', dataName: '已完成' },
        { dataCode: '04', dataName: '手动关闭' }
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
        reimburseCloseReason: ''
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
      this.handleGetTableDataList('sporadicPurchaseTracking/getPageList');
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
        return this.sporadicPurchaseStatusList[index].dataName;
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
          sporadicPurchaseStatus: '04',
          reimburseCloseReason: this.closeProjectForm.reimburseCloseReason
        };
        this.closeDialogVisible = false;
        this.$store.dispatch('sporadicPurchaseTracking/updateOrderStatus', params).then(res => {
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
      // 手动关闭后报销状态会被更改，并且在后续零星采购报销中无法再选择此采购单。您确定要关闭吗？
      this.closeDialogVisible = true;
      this.rowInformation = this.$clone(row);
      this.closeProjectForm.closeReason = '';
    },
    getRowClassNameMain({row}) {
      for (const item of row.sporadicPurchaseDetails) {
        if ((item.reimburseQuantity || 0) > (item.currentApplyQuantity || 0)) {
          this.$set(row, 'isError', true);
        }
      }
      return row.isError > 0 ? 'error-active' : '';
    },
    getRowClassName({row}) {
      if ((row.reimburseQuantity || 0) > (row.currentApplyQuantity || 0)) {
        return 'error-active';
      } else {
        return '';
      }
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
