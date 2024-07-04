<!--
 * @Author: your name
 * @Date: 2021-04-07 11:21:19
 * @LastEditTime: 2022-10-12 09:50:24
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial-项目材料管理\src\views\processExecutionTracking\orderTracking\orderTracking.vue
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
            <!-- 此功能是对供货订单被到货验收执行状态的管理，默认验收状态由供货订单单据明细与到货验收明细中数量的对比结果决定。 -->
              <div class="certificationTips-error">{{$t('orderTracking.certificationTips')}}</div>
              <!-- <span class="certificationTips-error">{{$t('subjectCertificationSummary.certificationTips2')}}</span> -->
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
                tableData: scope.row.supplyOrderDetails
              }"
              @fnName="pageConfigEmitQueryTableButtonFnName">
              </g-query-table>
          </template>
           <template slot="table-supplyOrderStatus" slot-scope="{row}">
              <div class="bestAuthStatus" :class="'bestAuthStatus'+row.supplyOrderStatus">
                {{setDocName(row.supplyOrderStatus)}}
              </div>
           </template>
          <template slot="table-buts-suffix" slot-scope="{ scope, item }">
            <template v-for="but in item.slotButs">
              <el-button
                :key="but.id"
                :class="but.class"
                :disabled="scope.row.supplyOrderStatus === '04' || scope.row.supplyOrderStatus === '05'"
                v-if="!but.noAuth ? authButtonList.indexOf(but.authCode) >= 0 : true"
                @click.stop.prevent="setFn(but, scope.row)"
                type="text"
                size="mini"
                v-fast-click>
                {{ $t(but.name) }}
              </el-button>
            </template>
          </template>
        </g-query-table>
      </template>
    </query-page>
    <el-dialog
      :title="$t('dialog.ccTips')"
      :visible.sync="dialogVisible"
      width="40%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item :label="$t('orderTracking.supplyOrderStatus')">
          <el-select v-model="form.supplyOrderStatus">
            <el-option label="未执行" value="01"></el-option>
            <el-option label="发货中" value="02"></el-option>
            <el-option label="部分供货" value="03"></el-option>
            <el-option label="已完成" value="04"></el-option>
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
  </div>
</template>

<script>
import Page from './config.js';
import { search } from 'mixins/searchMixins';
import Auth from 'util/auth';

export default {
  name: 'orderTracking',
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
        orgName: '',
        projectName: '',
        docNo: '',
        supplyOrderStatus: []
      },
      form: {
        supplyOrderStatus: ''
      },
      dialogVisible: false,
      demandStatusList: [
        {code: '01', name: '未执行'},
        {code: '02', name: '发货中'},
        {code: '03', name: '部分供货'},
        {code: '04', name: '已完成'},
        {code: '05', name: '手动关闭'}
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
      this.handleGetTableDataList('orderTracking/getPageList');
    },
    // 增、改、查 路由跳转设置
    handleInfo(row, type = 'info') {
      console.log(row, 'row');
      const routeName = 'supplyOrder';
      const translateType = type;
      type = this.$base64.encode(type);
      const id = this.$base64.encode(row.id || 0);
      const orderSource = this.$base64.encode('supplyOrder');
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
        `${this.$t('orderTracking.updateTipes')}?`,
        this.$t('orderTracking.updateTipesTitle'),
        {
          confirmButtonText: `${this.$t('button.determine')}`,
          cancelButtonText: `${this.$t('button.close')}`,
          type: 'warning'
        }
      )
        .then(() => {
          this.$store
            .dispatch('orderTracking/updateOrderStatus', {
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
          supplyOrderId: this.rowInformation.id,
          supplyOrderStatus: '05',
          closeReason: this.closeProjectForm.closeReason
        };
        this.closeDialogVisible = false;
        this.$store.dispatch('orderTracking/updateOrderStatus', params).then(res => {
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
      console.log('row', row);
      this.dialogVisible = true;
    },
    // 确定
    confirm() {
      this.$confirm(
        `${this.$t('orderTracking.updateTipes')}?`,
        this.$t('dialog.ccTips'),
        {
          confirmButtonText: `${this.$t('button.determine')}`,
          cancelButtonText: `${this.$t('button.close')}`,
          type: 'warning'
        }
      )
        .then(() => {
          this.$store
            .dispatch('orderTracking/updateOrderStatus', {
              supplyOrderId: this.row.id,
              supplyOrderStatus: this.form.supplyOrderStatus
            })
            .then(res => {
              if (res.status === 0) {
                this.form.supplyOrderStatus = '';
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
      for (const item of row.supplyOrderDetails) {
        if ((item.arrivalQuantity || 0) > (item.currentApplyQuantity || 0)) {
          this.$set(row, 'isError', true);
        }
      }
      return row.isError > 0 ? 'error-active' : '';
    },
    getRowClassName({row}) {
      if ((row.arrivalQuantity || 0) > (row.currentApplyQuantity || 0)) {
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
  line-height: 20px;;
  padding: 2px 10px;
  &.bestAuthStatus02 {
    color: #f55e14;
    background-color: rgba(245,94,20, 0.2);
  }
  &.bestAuthStatus03 {
    color: #2b74ec;
    background-color: rgba(43,116,236, 0.2);
  }
  &.bestAuthStatus04 {
    color: #24b568;
    background-color: rgba(36,181,104, 0.2);
    // color: #2b74ec;
    // background-color: rgba(43,116,236, 0.2);
  }
  &.bestAuthStatus05 {
    color: #24b568;
    background-color: rgba(36,181,104, 0.2);
    // color: #2b74ec;
    // background-color: rgba(43,116,236, 0.2);
  }
  &.bestAuthStatus2 {
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
