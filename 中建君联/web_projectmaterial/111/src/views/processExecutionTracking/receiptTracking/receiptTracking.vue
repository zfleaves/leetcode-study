
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
      <template slot="search" slot-scope="{configForm, searchFormValue}">
        <g-search-form :configForm="configForm"
                      :searchFormValue="searchFormValue"
                      @searchEvent="searchEvent"
                      v-on="$listeners">
          <template slot="form-supplierName" slot-scope="{searchFormValue, item}">
            <div class="slot-input">
                <el-input
                    v-model.trim="searchFormValue[item.prop]"
                    :size="item.size || 'small'"
                    readonly>
                    <template slot="suffix">
                        <i v-if="searchFormValue[item.prop]" class="slot-close el-icon-circle-close" @click="handleClearSupplier"></i>
                        <i class="multiple-choice-icon iconfont icon-menu" @click="handleSelectSupplier"></i>
                    </template>
                </el-input>
            </div>
          </template>
        </g-search-form>
      </template>
      <template slot="mainOperateBtn">
          <div class="certificationTips">
            <!-- 此功能是对材料入库在合同结算中执行状态的管理，默认结算状态由入库单据明细与合同结算明细中数量的对比结果决定。 -->
              <div class="certificationTips-error">{{$t('receiptTracking.certificationTips')}}</div>
          </div>
      </template>
      <template slot="mainTable" slot-scope="config">
        <g-query-table :config="config.scope" :tableList.sync="tableSeleList"
         @fnName="pageConfigEmitQueryTableButtonFnName"
          :getRowClassName="getRowClassNameMain">
          <template slot="expand" slot-scope="{scope}">
              <g-query-table
              style="margin-left: 40px;"
              :getRowClassName="getRowClassName"
              :config="{
                tableList: pageConfig.childrenMainTable.tableList,
                tableData: scope.row.incomingDetails
              }"
              @fnName="pageConfigEmitQueryTableButtonFnName">
              </g-query-table>
          </template>
          <!-- 下单状态 -->
          <template slot="table-executeStatus" slot-scope="{row}">
            <div class="bestAuthStatus" :class="'bestAuthStatus'+row.executeStatus">
              {{setDocName(row.executeStatus)}}
            </div>
          </template>
        </g-query-table>
      </template>
    </query-page>
    <!-- 选择乙方单位 -->
    <g-dialog v-if="partyBFlag" :dialogConfig="partyBDialogConfig" :isVisible.sync="partyBFlag">
      <partyBDialog slot="body" slot-scope="{height}" :dialogHeight="height"
        :selectId='pageConfig.searchControls.searchData.supplierId || 0' :close.sync="partyBFlag" @getData="getPartyB" v-if="partyBFlag">
      </partyBDialog>
    </g-dialog>
  </div>
</template>

<script>
import Page from './config.js';
import { search } from 'mixins/searchMixins';

export default {
  name: 'receiptTracking',
  mixins: [search],
  components: {
    partyBDialog (resolve) {
      require(['components/basicComponents/global/dialog/partyBDialog/partyB.vue'], resolve);
    }
  },
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
        belongOrgName: '',
        docNo: '',
        executeStatus: '',
        incomingDateFrom: '',
        incomingDateTo: '',
        mainMaterials: '',
        projectName: '',
        supplierName: '',
        supplierId: ''
      },
      executeStatusList: [
        {dataCode: '01', dataName: '未结算'},
        {dataCode: '02', dataName: '部分结算'},
        {dataCode: '03', dataName: '已完成'}
      ],
      // 乙方
      partyBDialogConfig: {
        title: `${this.$t('tips.pleaseSelect')}${this.$t('receiptTracking.supplierName')}`,
        appendBody: false,
        center: true,
        top: '80px',
        width: '80%',
        span: '0.7'
      },
      partyBFlag: false
    };
  },
  async created() {
    this.pageSize = 10;
    await this._getTableDataList();
  },
  methods: {
    // 获取表单
    _getTableDataList() {
      this.handleGetTableDataList('receiptTracking/getPageList');
    },
    // 搜索
    handleSearch() {
      this._getTableDataList();
    },
    // 增、改、查 路由跳转设置
    handleInfo(row, type = 'info') {
      const routeName = 'warIncoming';
      const translateType = type;
      type = this.$base64.encode(type);
      const id = this.$base64.encode(row.id || 0);
      const checkArrivalId = this.$base64.encode(0);
      const RouteTitleObj = { name: `${routeName}Edit`, loadRouteName: routeName, translateType };
      localStorage.setItem('RouteTitle', JSON.stringify(RouteTitleObj));
      this.$router.push(`/${routeName}Edit/${type}/${id}/warIncoming/${checkArrivalId}/${routeName}`);
    },
    // 状态
    setDocName(code) {
      const index = this.executeStatusList.findIndex(v => v.dataCode === code);
      if (index >= 0) {
        return this.executeStatusList[index].dataName;
      } else {
        return '';
      }
    },
    // 点击生成对账单
    sysHandleGenerateStatement() {
      if (!this.pageConfig.searchControls.searchData.supplierId) {
        // 请选择需要对账的供应商！
        this.$message.error(this.$t('receiptTracking.selectSupplier'));
        return;
      }
      this.sysHandlePrint();
    },
    // 打印
    sysHandlePrint() {
      if (this.tableSeleList.length === 0) {
        this.$message({
          message: '请您先选中想要进行打印的一行数据。',
          type: 'info'
        });
        return;
      }
      localStorage.setItem('printSupplierName', this.pageConfig.searchControls.searchData.supplierName);
      const ids = this.tableSeleList.map(v => v.id).join(',');
      const incomingDateList = this.tableSeleList.map(v => new Date(v.incomingDate));
      const maxDate = this.$utils.commonUtil.formatDate(new Date(Math.max.apply(null, incomingDateList)));
      const minDate = this.$utils.commonUtil.formatDate(new Date(Math.min.apply(null, incomingDateList)));
      if (incomingDateList.length > 1) {
        localStorage.setItem('printIncomingDate', `${minDate}${this.$t('tips.to')}${maxDate}`);
      } else if (incomingDateList.length === 1) {
        localStorage.setItem('printIncomingDate', maxDate);
      } else {
        localStorage.setItem('printIncomingDate', '');
      }
      const printModelCode = this.$base64.encode(this.pageConfig.formCode);
      const taskId = this.$base64.encode(0); // 打印
      const id = this.$base64.encode(ids);
      const RouteTitleObj = { name: 'printDesign', loadRouteName: this.$route.name, translateType: 'print' };
      localStorage.setItem('RouteTitle', JSON.stringify(RouteTitleObj));
      this.$router.push(`/printDesign/${printModelCode}/${taskId}/${id}/${this.$route.name}`);
    },
    // ============ 供应商 ============
    // 清除
    handleClearSupplier() {
      this.$set(this.pageConfig.searchControls.searchData, 'supplierId', '');
      this.$set(this.pageConfig.searchControls.searchData, 'supplierName', '');
      this.pageNo = 1;
      this._getTableDataList();
    },
    // 选择
    handleSelectSupplier() {
      this.partyBFlag = true;
    },
    // 选中的数据
    getPartyB(arr) {
      this.$set(this.pageConfig.searchControls.searchData, 'supplierId', arr.length > 0 ? arr[0].id : '');
      this.$set(this.pageConfig.searchControls.searchData, 'supplierName', arr.length > 0 ? arr[0].partyBName : '');
      this.partyBFlag = false;
      this.pageNo = 1;
      this._getTableDataList();
    },
    getRowClassNameMain({row}) {
      for (const item of row.incomingDetails) {
        if (row.settlementQuantity && ((item.settlementQuantity || 0) > (item.currentIncomingQuantity || 0))) {
          this.$set(row, 'isError', true);
        }
      }
      return row.isError > 0 ? 'error-active' : '';
    },
    getRowClassName({row}) {
      if (row.settlementQuantity && ((row.settlementQuantity || 0) > (row.currentIncomingQuantity || 0))) {
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
  &.bestAuthStatus01 {
    color: #f73535;
    background-color: rgba(247,53,53, 0.2);
  }
  &.bestAuthStatus02 {
    color: #2b74ec;
    background-color: rgba(43,116,236, 0.2);
  }
  &.bestAuthStatus03 {
    color: #24b568;
    background-color: rgba(36,181,104, 0.2);
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
