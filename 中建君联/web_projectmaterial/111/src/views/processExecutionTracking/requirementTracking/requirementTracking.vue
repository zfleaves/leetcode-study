<!--
 * @Author: your name
 * @Date: 2021-04-07 11:21:29
 * @LastEditTime: 2022-10-12 09:30:00
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial-项目材料管理\src\views\processExecutionTracking\requirementTracking\requirementTracking.vue
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
      @searchEvent="searchEvent"
    >
      <template slot="mainOperateBtn">
          <div class="certificationTips">
            <!-- 此功能是对需求计划被供货订单下单的状态管理，默认下单状态由需求计划单据明细与供货订单明细中数量的对比结果决定。 -->
              <div class="certificationTips-error">{{$t('requirementTracking.certificationTips')}}</div>
              <!-- <span class="certificationTips-error">{{$t('subjectCertificationSummary.certificationTips2')}}</span> -->
          </div>
      </template>
      <template slot="mainTable" slot-scope="config">
        <g-query-table
           :config="config.scope"
           @fnName="pageConfigEmitQueryTableButtonFnName"
            :tableList.sync="tableSeleList"
            :getRowClassName="getRowClassNameMain"
          >
          <template slot="expand" slot-scope="{scope}">
              <g-query-table
              style="margin-left: 40px;"
              :getRowClassName="getRowClassName"
              :config="{
                tableList: pageConfig.childrenMainTable.tableList,
                tableData: scope.row.details
              }"
              @fnName="pageConfigEmitQueryTableButtonFnName">
              </g-query-table>
          </template>
          <!-- 下单状态 -->
          <template slot="table-demandStatus" slot-scope="{row}">
            <div class="bestAuthStatus" :class="'bestAuthStatus'+row.demandStatus">
              {{setDocName(row.demandStatus)}}
            </div>
          </template>
          <template slot="table-sporadicPurchaseStatus" slot-scope="{row}">
            <div class="bestAuthStatus" :class="'bestAuthStatus'+row.sporadicPurchaseStatus">
              {{setDocName(row.sporadicPurchaseStatus)}}
            </div>
          </template>
          <!--  总仓发货 -->
          <template slot="table-supplyDemandStatus" slot-scope="{item, row}">
            <div class="bestAuthStatus" :class="'bestAuthStatus'+row.supplyDemandStatus">
              {{setDicData(row.supplyDemandStatus, item.selectList)}}
            </div>
          </template>
          <!-- 申请月/周/日 -->
          <template slot="table-applyDate" slot-scope="{ row,item }">
            <span v-if="row.demandPlanTypeCode==='01'">{{row.applyMonth }}</span>
            <span v-else-if="row.demandPlanTypeCode==='02'">
              {{row[item.prop] && row[item.prop].substring(0, 4)}}{{$t('time.year')}}{{row[item.prop] && row[item.prop].substring(5, 7)}}{{$t('time.month')}}
              {{$t('tips.theFirst')}}{{row.applyWeek}}{{$t('time.week')}}
            </span>
            <span v-else>{{row.applyDate | setDate}}</span>
          </template>
          <!-- <template slot="table-buts-suffix" slot-scope="{ scope, item }">
            <template v-for="but in item.slotButs">
              <el-button
                :key="but.id"
                :class="but.class"
                v-if="!but.noAuth ? authButtonList.indexOf(but.authCode) >= 0 : true"
                @click.stop.prevent="setFn(but, scope.row)"
                type="text"
                size="mini"
                v-fast-click
              >
                {{ $t(but.name) }}
              </el-button>
            </template>
          </template> -->
          <template slot="table-buts-suffix" slot-scope="{scope}">
            <el-button :disabled="setQuickOrderStatus(scope.row)"
              v-if="authButtonList.indexOf('quickOrder') >= 0 ? true :false"
               @click.stop.prevent="handleQuickOrder(scope.row)"
              type="text" size="mini" v-fast-click>
              {{$t('requirementTracking.quickOrder')}}
            </el-button>
            <!-- 手动关闭 -->
            <el-button  :disabled="scope.row.demandStatus === '04' || scope.row.demandStatus === '03'"
              v-if="authButtonList.indexOf('forceUpdate') >= 0 ? true :false"
               @click.stop.prevent="sysHandleForceUpdate(scope.row)"
              type="text" size="mini" v-fast-click  class="danger">
              {{$t('button.closed')}}
            </el-button>
          </template>
        </g-query-table>
      </template>
    </query-page>
    <el-dialog
      :title="$t('dialog.ccTips')"
      :visible.sync="dialogVisible"
      width="40%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item :label="$t('requirementTracking.demandStatus')">
          <el-select v-model="form.demandStatus">
            <el-option label="未下单" value="01"></el-option>
            <el-option label="部分下单" value="02"></el-option>
            <el-option label="已全部下单" value="03"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{$t('button.close')}}</el-button>
        <el-button type="primary" @click="confirm">{{$t('button.determine')}}</el-button>
      </span>
    </el-dialog>
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
    <!--快速下单 -->
    <g-dialog v-if="quickOrderDialogVisible" :dialogConfig="quickOrderDialogVisibleConfig" :isVisible.sync="quickOrderDialogVisible">
      <div class="content" slot="body">
        <div class="title">
          <!-- 下单方式 -->
          <span class="title-tips">{{$t('requirementTracking.orderingMethod')}}：</span>
          <span>
              <!--下送货通知单、下零星采购单。  -->
              <el-radio v-model="fastSupplyOrder" label="supplyOrder">{{$t('requirementTracking.delivery')}}</el-radio>
              <el-radio v-model="fastSupplyOrder" label="sporadicPurchase">{{$t('requirementTracking.sporadicPurchase')}}</el-radio>
          </span>
        </div>
        <!-- 注：下送货通知单时必须关联一个合同进行下单。 -->
        <div class="tipsText">
          <span style="color: red;">{{$t('requirementTracking.explainTips')}}</span>
        </div>
      </div>
      <div slot="footer" class="footer">
        <el-button class="urgent" type="primary" icon="el-icon-circle-close" size="small" @click="quickOrderDialogVisible = false">
          {{$t('button.close')}}
        </el-button>
        <el-button size="small" type="primary" icon="el-icon-circle-check" @click="drawerQuickOrder" v-fast-click>
          {{$t('button.determine')}}
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
  name: 'requirementTracking',
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
        createByName: '',
        orgName: '',
        projectName: '',
        docNo: '',
        demandStatus: [],
        createTimeFrom: '',
        createTimeTo: ''
      },
      form: {
        demandStatus: ''
      },
      dialogVisible: false,
      demandStatusList: [
        {code: '01', name: '未下单'},
        {code: '02', name: '部分下单'},
        {code: '03', name: '已完成'},
        {code: '04', name: '手动关闭'}
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
        closeReason: ''
      },
      rowInformation: {},
      // 快速下单
      quickOrderDialogVisible: false,
      quickOrderDialogVisibleConfig: {
        title: this.$t('requirementTracking.quickOrder'),
        appendBody: false,
        center: true,
        top: '200px',
        width: '25%',
        span: '0.25'
      },
      fastSupplyOrder: '',
      orderList: {}
    };
  },
  async created() {
    this.pageSize = 10;
    await this._getTableDataList();
  },
  methods: {
    // 获取表单
    _getTableDataList() {
      this.handleGetTableDataList('requirementTracking/getPageList');
    },
    // 增、改、查 路由跳转设置
    handleInfo(row, type = 'info') {
      // 01 月 02 周 03 临时
      const code = row.demandPlanTypeCode;
      const routeName = code === '01' ? 'monthPlan' : code === '02' ? 'weekPlan' : 'tempPlan';
      const translateType = type;
      type = this.$base64.encode(type);
      const id = this.$base64.encode(row.id || 0);
      const RouteTitleObj = { name: `${routeName}Edit`, loadRouteName: routeName, translateType };
      localStorage.setItem('RouteTitle', JSON.stringify(RouteTitleObj));
      this.$router.push(`/${routeName}Edit/${type}/${id}/${routeName}`);
    },
    setFn(btnParameter, row) {
      this[btnParameter.fn](row);
    },
    // 下单状态
    setDocName(code) {
      const index = this.demandStatusList.findIndex(v => v.code === code);
      if (index >= 0) {
        return this.demandStatusList[index].name;
      } else {
        return '';
      }
    },
    // 更新
    sysHandleRenew() {
      this.$confirm(
        `${this.$t('requirementTracking.updateTipes')}?`,
        this.$t('requirementTracking.updateTipesTitle'),
        {
          confirmButtonText: `${this.$t('button.determine')}`,
          cancelButtonText: `${this.$t('button.close')}`,
          type: 'warning'
        }
      )
        .then(() => {
          this.$store
            .dispatch('requirementTracking/updateOrderStatus', {
            //   supplyOrderId: row.id
            //   supplyOrderStatus: row.id
            })
            .then(res => {
              if (res.status === 0) {
                this._getTableDataList();
              } else {
                this.$message.error(`${this.$t(`exception.${res.errorCode}`)}`);
              }
            });
        })
        .catch(() => {});
    },
    // 保存关闭原因弹窗
    drawerItemSave() {
      this.$refs.projectForm.getValidateForm(() => {
        const loading = this.getLoading();
        const params = {
          demandPlanId: this.rowInformation.id,
          demandPlanTypeCode: this.rowInformation.demandPlanTypeCode,
          demandStatus: '04',
          closeReason: this.closeProjectForm.closeReason
        };
        this.closeDialogVisible = false;
        this.$store.dispatch('requirementTracking/updateOrderStatus', params).then(res => {
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
      this.closeDialogVisible = true;
      this.rowInformation = this.$clone(row);
      this.closeProjectForm.closeReason = '';
    },
    // 修改
    handleEdit(row) {
      this.row = this.$clone(row);
      this.dialogVisible = true;
    },
    // 确定
    confirm() {
      this.$confirm(
        `${this.$t('requirementTracking.updateTipes')}?`,
        this.$t('dialog.ccTips'),
        {
          confirmButtonText: `${this.$t('button.determine')}`,
          cancelButtonText: `${this.$t('button.close')}`,
          type: 'warning'
        }
      )
        .then(() => {
          this.$store
            .dispatch('requirementTracking/updateOrderStatus', {
              demandPlanId: this.row.id,
              demandPlanTypeCode: this.row.demandPlanTypeCode,
              demandStatus: this.form.demandStatus
            })
            .then(res => {
              if (res.status === 0) {
                this.form.demandStatus = '';
                this._getTableDataList();
              } else {
                this.$message.error(`${this.$t(`exception.${res.errorCode}`)}`);
              }
            });
        })
        .catch(() => {});
      this.dialogVisible = false;
    },
    getRowClassNameMain({row}) {
      for (const item of row.details) {
        const quantity = Number(item.supplyOrderQuantity + item.sporadicPurchaseQuantity);
        if ((item.currentApplyQuantity || 0) < (quantity || 0)) {
          this.$set(row, 'isError', true);
        }
      }
      return row.isError > 0 ? 'error-active' : '';
    },
    getRowClassName({row}) {
      const quantity = Number(row.supplyOrderQuantity + row.sporadicPurchaseQuantity);
      if ((row.currentApplyQuantity || 0) < (quantity || 0)) {
        return 'error-active';
      } else {
        return '';
      }
    },
    setQuickOrderStatus(row) {
      const flag = row.demandStatus === '03' && row.sporadicPurchaseStatus === '03';
      return flag;
    },
    // 打开快速下单弹窗
    handleQuickOrder(row) {
      this.quickOrderDialogVisible = true;
      this.orderList = row;
    },
    // 确定下单
    drawerQuickOrder() {
      const routeName = this.fastSupplyOrder === 'supplyOrder' ? 'supplyOrder' : 'sporadicPurchase';
      if (!this.fastSupplyOrder) {
        return this.$message.error(`${this.$t('tips.pleaseSelect')}${this.$t('requirementTracking.orderingMethod')}`);
      }
      // 您没有_送货通知单_的菜单权限，不能下单，请联系管理员后再来操作。
      const menu = this.$utils.menu.getCurrentMenu(routeName);
      if (JSON.stringify(menu) === '{}') {
        return this.$message.error(this.$t('requirementTracking.menuTips').replace('{keyValue}', this.$t(`${'menu.'}${routeName}`)));
      }
      // console.log(menu, 'menu');
      this.handleQuickOrderRouter(this.orderList, routeName);
      this.quickOrderDialogVisible = false;
    },
    handleQuickOrderRouter(row, name, type = 'order') {
      let orderSource = '';
      // 01 月 02 周 03 临时
      if (row.demandPlanTypeCode === '01') {
       orderSource = this.$base64.encode('monthPlan'); // 下单来源
      }
      if (row.demandPlanTypeCode === '02') {
       orderSource = this.$base64.encode('weekPlan');
      }
      if (row.demandPlanTypeCode === '03') {
       orderSource = this.$base64.encode('tempPlan');
      }
      this.fastSupplyOrder = '';
      const translateType = type;
      type = this.$base64.encode(type);
      const orderSourceId = this.$base64.encode(row.id || 0);
      const id = this.$base64.encode(0);
      const routeName = name;
      const RouteTitleObj = { name: `${routeName}Edit`, loadRouteName: routeName, translateType };
      localStorage.setItem('RouteTitle', JSON.stringify(RouteTitleObj));
      this.$router.push(`/${routeName}Edit/${type}/${id}/${routeName}/${orderSourceId}/${orderSource}`);
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
  line-height: 20px;
  padding: 2px 10px;
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
.content{
  padding: 10px;
  margin-bottom: 40px;
  .title {
    height: 70px;
    line-height: 70px;
    .title-tips {
      margin-right: 20px;
    }
  }
}
</style>
