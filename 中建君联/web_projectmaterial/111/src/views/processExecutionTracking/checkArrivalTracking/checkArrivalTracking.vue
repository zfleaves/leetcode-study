
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
            <!-- 此功能是对到货验收在材料入库中执行状态的管理，入库状态由到货验收单据明细与材料入库明细中数量的对比结果决定。 -->
              <div class="certificationTips-error">{{$t('checkArrivalTracking.certificationTips')}}</div>
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
                  tableData: scope.row.checkArrivalDetails
                }"
                @fnName="pageConfigEmitQueryTableButtonFnName">
                <template slot="table-incomingQuantity" slot-scope="{row}">
                    <div>{{row.incomingQuantity ? row.incomingQuantity: 0}}</div>
                </template>
              </g-query-table>
          </template>
        <!-- 入库状态 -->
          <template slot="table-incomingStatus" slot-scope="{row, item}">
            <div class="incomingStatus" :class="'incomingStatus'+row.incomingStatus">
              {{setDicData(row.incomingStatus, item.selectList, item)}}
            </div>
          </template>
          <!-- 快速入库 -->
          <template slot="table-buts" slot-scope="{scope}">
            <el-button
              class="primary"
              v-if="authButtonList.indexOf('quickInWarehouse') >= 0"
              @click.stop.prevent="sysHandleQuickInWarehouse(scope)"
              :disabled='scope.incomingStatus === "03"'
              type="text" size="mini" v-fast-click>
              {{$t('checkArrivalTracking.quickInWarehouse')}}
            </el-button>
          </template>
        </g-query-table>
      </template>
    </query-page>
  </div>
</template>

<script>
import Page from './config.js';
import { search } from 'mixins/searchMixins';

export default {
  name: 'checkArrivalTracking',
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
        checkDateFrom: '',
        checkDateTo: '',
        docNo: '',
        flowStatus: ['02'],
        incomingStatus: [],
        projectName: '',
        supplierName: '',
        supplyOrderName: '',
        orgName: ''
      }
    };
  },
  async created() {
     this.authButtonList = this.$route.meta.authButtonList && this.$route.meta.authButtonList.map(v => v.resUrl);
     console.log(this.authButtonList, 'authButtonList');
    this.pageSize = 10;
    await this._getTableDataList();
  },
  methods: {
    // 获取表单
    _getTableDataList() {
      this.handleGetTableDataList('checkArrivalTracking/getPageList');
    },
    // 增、改、查 路由跳转设置
    handleInfo(row, type = 'info') {
      const routeName = 'checkArrival';
      const translateType = type;
      type = this.$base64.encode(type);
      const id = this.$base64.encode(row.id || 0);
      const RouteTitleObj = { name: `${routeName}Edit`, loadRouteName: routeName, translateType };
      localStorage.setItem('RouteTitle', JSON.stringify(RouteTitleObj));
      this.$router.push(`/${routeName}Edit/${type}/${id}/${routeName}`);
    },
    // 表格数据字典
    setDicData(value, selectList, item) {
      const index = selectList && selectList.findIndex(v => v.dataCode === value);
      if (index < 0) return '';
      return item.isTranslate ? this.$t(selectList[index].dataName) : selectList[index].dataName;
    },
    getRowClassNameMain({row}) {
      for (const item of row.checkArrivalDetails) {
        if ((item.incomingQuantity || 0) > (item.checkPassedQuantity || 0)) {
          this.$set(row, 'isError', true);
        }
      }
      return row.isError > 0 ? 'error-active' : '';
    },
    getRowClassName({row}) {
      if ((row.incomingQuantity || 0) > (row.checkPassedQuantity || 0)) {
        return 'error-active';
      } else {
        return '';
      }
    },
      // 快速入库
      sysHandleQuickInWarehouse(row, type = 'add') {
        if (row.id) {
          if (!this.judgeSamePerson(row)) {
            this.editError(this.$t('checkArrivalTracking.quickInWarehouse'));
            return;
          }
        }
        // 此单据已经办理过快速入库，确定要再次入库吗？
        // 快速入库会跳转到材料入库页面，您确定要跳转吗
        const message = `${this.$t('checkArrivalTracking.quickInWarehouseTips')}？<br>
        <span style="color:red">${row.ifFastIncoming ? this.$t('checkArrivalTracking.quickInWarehouseTips1') : ''}</span>`;
        this.$confirm(message, this.$t('checkArrivalTracking.quickInWarehouse'), {
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
         this.$router.push(`/${routeName}Edit/${type}/${id}/checkArrival/${checkArrivalId}/${routeName}`);
      }
  }
};
</script>

<style scoped lang="scss">
.incomingStatus {
  font-size: 14px;
  width: 100%;
  max-width: 100px;
  line-height: 20px;
  padding: 2px 0;
  text-align: center;
  &.incomingStatus01 {
    color: #f73535;
    background-color: rgba(247,53,53, 0.2);
  }
  &.incomingStatus02 {
    color: #2b74ec;
    background-color: rgba(43,116,236, 0.2);
  }
  &.incomingStatus03 {
    color: #24b568;
    background-color: rgba(36,181,104, 0.2);
  }
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
