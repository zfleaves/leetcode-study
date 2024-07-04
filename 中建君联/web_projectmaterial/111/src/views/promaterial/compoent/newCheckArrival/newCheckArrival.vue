<!--
 * @Author: your name
 * @Date: 2021-04-14 15:55:56
 * @LastEditTime: 2021-10-28 18:21:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\compoent\newCheckArrival\newCheckArrival.vue
-->
<template>
  <div class="materialVarieties">
    <div class="materialVarieties-cont">
      <div class="left" v-loading="loading" :element-loading-text="$t('tips.loadingText')">
        <el-tabs v-model="activeName">
          <el-tab-pane :label="$t(varietiesTitle)" name="second">
            <div class="cons">
              <div class="search-cons">
                <el-input v-model.trim="varietiesName" prefix-icon="el-icon-search"
                  :placeholder="$t('tips.varietiesNameTips')" size="small" clearable
                  @keyup.enter.native="sysHandleSearch" maxlength="64">
                </el-input>
              </div>
              <div class="cons-table-t content">
                <g-query-table :config="mainTable" ref="mainTable" @tableList="getTableSeleList">
                </g-query-table>
              </div>
            </div>
          </el-tab-pane>
          <!-- 历史数据 -->
          <el-tab-pane :label="$t('fConfig.historicalSupplyorderDetails')" name="first">
            <div class="cons">
              <div class="search-cons">
                <el-input v-model.trim="historyVarietiesName" prefix-icon="el-icon-search"
                  :placeholder="$t('tips.varietiesNameTips')" size="small" clearable
                  @keyup.enter.native="historySysHandleSearch" maxlength="64">
                </el-input>
              </div>
              <div class="cons-table-t content">
                <g-query-table :config="historyMainTable" ref="mainTable" @tableList="getHistoryTableSeleList">
                </g-query-table>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('fConfig.orderSupplyorderDetails')" name="third">
            <div class="cons">
              <div class="search-cons">
                <el-input v-model.trim="orderVarietiesName" prefix-icon="el-icon-search"
                  :placeholder="$t('tips.varietiesNameTips')" size="small" clearable
                  @keyup.enter.native="getOrderVarietiesDateilList" maxlength="64">
                </el-input>
              </div>
              <div class="cons-table-t content">
                <g-query-table :config="orderMainTable" ref="mainTable" @tableList="getOrderTableSeleList">
                </g-query-table>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="right">
        <div class="title">{{$t('tips.selected')}}</div>
        <g-query-table :config="selectMainTable">
        </g-query-table>
      </div>
    </div>
    <div class="footer">
      <el-button class="urgent" type="primary" icon="el-icon-circle-close" size="small"
        @click="handleDialogStatus('close')">{{$t('button.close')}}</el-button>
      <el-button size="small" type="primary" icon="el-icon-circle-check" @click="handleDialogStatus('save')"
        v-fast-click>{{$t('button.determine')}}</el-button>
    </div>
  </div>
</template>

<script>
import { search } from 'mixins/searchMixins';

export default {
  name: 'newCheckArrival',
  mixins: [search],
  data () {
    return {
      loading: false,
      activeName: 'second',
      props: {
        label: 'varietiesName',
        children: 'children',
        isLeaf: 'leaf'
      },
      mainTable: {
        // 表格数据
        tableData: [],
        rowKey: 'rowKey',
        // 多选
        isCheckbox: true,
        tableList: [
          // 材料品种名称
          { show: true, prop: 'executeVarietiesName', label: 'fConfig.varietiesName', minWidth: '140' },
          // 材料品种编码
          { show: true, prop: 'varietiesCode', label: 'fConfig.varietiesCode', minWidth: '120' },
          // 规格
          { show: true, prop: 'executeStandards', label: 'fConfig.standards' },
          // 型号
          { show: true, prop: 'models', label: 'fConfig.models' },
          // 品牌
          { show: true, prop: 'brand', label: 'fConfig.brand' },
          // 单位
          { show: true, prop: 'executeUnit', label: 'fConfig.unit', minWidth: '60' },
          // 拟使用部位
          { show: true, prop: 'usePlaceName', label: 'checkArrival.usePlaceName', minWidth: '100' },
          // 备注
          { show: true, prop: 'supplyRemarks', label: 'fConfig.remarks' },
          // 订单数量
          { show: true, prop: 'currentApplyQuantity', label: 'checkArrival.currentApplyQuantity', minWidth: '80' }
        ]
      },
      selectMainTable: {
        rowKey: 'rowKey',
        // 表格数据
        tableData: [],
        // 表格高度
        maxHeight: 500,
        // 子系统表头渲染参数
        tableList: [
          // 材料品种名称
          { show: true, prop: 'executeVarietiesName', label: 'fConfig.varietiesName', minWidth: '140' },
          // 材料品种编码
          { show: true, prop: 'varietiesCode', label: 'fConfig.varietiesCode', minWidth: '120' },
          // 规格
          { show: true, prop: 'executeStandards', label: 'fConfig.standards' },
          // 型号
          { show: true, prop: 'models', label: 'fConfig.models' },
          // 品牌
          { show: true, prop: 'brand', label: 'fConfig.brand' },
          // 单位
          { show: true, prop: 'executeUnit', label: 'fConfig.unit', minWidth: '60' },
          // 拟使用部位
          { show: true, prop: 'usePlaceName', label: 'checkArrival.usePlaceName', minWidth: '100' },
          // 备注
          { show: true, prop: 'supplyRemarks', label: 'fConfig.remarks' }
          // // 订单数量
          // { show: true, prop: 'currentApplyQuantity', label: 'checkArrival.currentApplyQuantity', minWidth: '80' }
        ]
      },
      historyMainTable: {
        rowKey: 'rowKey',
        // 多选
        isCheckbox: true,
        // 表格数据
        tableData: [],
        // 表格高度
        maxHeight: 500,
        // 子系统表头渲染参数
        tableList: [
          // 材料品种名称
          { show: true, prop: 'executeVarietiesName', label: 'fConfig.varietiesName', minWidth: '140' },
          // 材料品种编码
          { show: true, prop: 'varietiesCode', label: 'fConfig.varietiesCode', minWidth: '120' },
          // 规格
          { show: true, prop: 'executeStandards', label: 'fConfig.standards' },
          // 型号
          { show: true, prop: 'models', label: 'fConfig.models' },
          // 品牌
          { show: true, prop: 'brand', label: 'fConfig.brand' },
          // 单位
          { show: true, prop: 'executeUnit', label: 'fConfig.unit', minWidth: '60' },
          // 拟使用部位
          { show: true, prop: 'usePlaceName', label: 'checkArrival.usePlaceName', minWidth: '100' },
          // 备注
          { show: true, prop: 'supplyRemarks', label: 'fConfig.remarks' },
          // 订单数量
          { show: true, prop: 'currentApplyQuantity', label: 'checkArrival.currentApplyQuantity', minWidth: '80' }
        ]
      },
      orderMainTable: {
        // 表格数据
        tableData: [],
        rowKey: 'rowKey',
        // 多选
        isCheckbox: true,
        tableList: [
          // 材料品种名称
          { show: true, prop: 'executeVarietiesName', label: 'fConfig.varietiesName', minWidth: '140' },
          // 材料品种编码
          { show: true, prop: 'varietiesCode', label: 'fConfig.varietiesCode', minWidth: '120' },
          // 规格
          { show: true, prop: 'executeStandards', label: 'fConfig.standards' },
          // 型号
          { show: true, prop: 'models', label: 'fConfig.models' },
          // 品牌
          { show: true, prop: 'brand', label: 'fConfig.brand' },
          // 单位
          { show: true, prop: 'executeUnit', label: 'fConfig.unit', minWidth: '60' },
          // 拟使用部位
          { show: true, prop: 'usePlaceName', label: 'checkArrival.usePlaceName', minWidth: '100' },
          // 备注
          { show: true, prop: 'supplyRemarks', label: 'fConfig.remarks' },
          // 订单数量
          { show: true, prop: 'currentApplyQuantity', label: 'checkArrival.currentApplyQuantity', minWidth: '80' }
        ]
      },
      varietiesName: '',
      historyVarietiesName: '',
      orderVarietiesName: '',
      // =====================
      tableSeleList: [],
      varietiesDateilUrl: '',
      historyVarietiesDateilUrl: '',
      orderVarietiesDateilUrl: '',
      tableHistoryCheckData: [],
      tableCheckData: [],
      tableOrderData: []
    };
  },
  props: {
    dialogHeight: {
      type: Number,
      default: 300
    },
    // 左侧的展示标题
    varietiesTitle: {
      type: String,
      default: 'fConfig.varieties'
    },
    // 选中的品种
    selectList: {
      default: []
    },
    supplyOrderDeliverIds: {
      default: []
    },
    projectId: {
      default: 0
    },
    supplyOrderId: {
      default: 0
    }
  },
  async created () {
    this.selectMainTable.maxHeight = this.dialogHeight - 140;
    this.historyMainTable.maxHeight = this.dialogHeight - 200;
    this.mainTable.maxHeight = this.dialogHeight - 200;
    this.orderMainTable.maxHeight = this.dialogHeight - 200;
    this.varietiesDateilUrl = 'checkArrival/getSupplyorderCheckarival';
    this.historyVarietiesDateilUrl = 'checkArrival/getHistorySupplyorderCheckarival';
    this.orderVarietiesDateilUrl = 'checkArrival/getSupplyorderDeliverDetailList';
    const selectList = this.$clone(this.selectList);
    selectList.forEach((item, index) => {
      item.rowKey = `${item.eId}-${item.varietiesId}`;
      item.sort = selectList.length - index;
      this.selectMainTable.tableData.push(item);
    });
    this.getVarietiesDateilList();
    this.getHistoryVarietiesDateilList();
    this.getOrderVarietiesDateilList();
  },
  methods: {
    // 获取材料明细 /demand/month/purchase/apply/plan
    getVarietiesDateilList () {
      this.loading = true;
      const data = {
        projectId: this.projectId,
        supplyOrderId: this.supplyOrderId,
        varietiesName: this.varietiesName
      };
      this.$store.dispatch(this.varietiesDateilUrl, data).then(res => {
        if (res.status === 0) {
          const selectList = [];
          const supplyOrderDetails = res.results && res.results.length ? res.results[0].supplyOrderDetails : [];
          supplyOrderDetails.forEach(item => {
            item.rowKey = `${item.id}-${item.varietiesId}`;
            this.$set(item, 'demandPlanDetailId', item.eId);
            this.$set(item, 'eId', item.id);
            const index = this.selectList.findIndex(v => `${v.eId}-${v.varietiesId}` === item.rowKey);
            if (index >= 0) {
              selectList.push(item);
            }
          });
          this.mainTable.tableData = supplyOrderDetails;
          this.mainTable.selectedList = selectList;
        } else {
          this.$message.error(this.$t(`exception.${res.errorCode}`));
        }
        this.loading = false;
      }).catch(e => {
        this.loading = false;
      });
    },
    // 获取历史数据
    getHistoryVarietiesDateilList () {
      this.loading = true;
      const data = {
        projectId: this.projectId,
        supplyOrderId: this.supplyOrderId,
        varietiesName: this.historyVarietiesName
      };
      this.$store.dispatch(this.historyVarietiesDateilUrl, data).then(res => {
        if (res.status === 0) {
          const selectList = [];
          const supplyOrderDetails = res.results && res.results.length ? res.results[0].supplyOrderDetails : [];
          supplyOrderDetails.forEach(item => {
            item.rowKey = `${item.id}-${item.varietiesId}`;
            this.$set(item, 'demandPlanDetailId', item.eId);
            this.$set(item, 'eId', item.id);
            const index = this.selectList.findIndex(v => `${v.eId}-${v.varietiesId}` === item.rowKey);
            if (index >= 0) {
              selectList.push(item);
            }
          });
          this.historyMainTable.tableData = supplyOrderDetails;
          this.historyMainTable.selectedList = selectList;
        } else {
          this.$message.error(this.$t(`exception.${res.errorCode}`));
        }
        this.loading = false;
      }).catch(e => {
        console.log(e, 'e');
        this.loading = false;
      });
    },
    // 获取送货单数据
    getOrderVarietiesDateilList () {
      this.loading = true;
      const data = {
        projectId: this.projectId,
        supplyOrderId: this.supplyOrderId,
        varietiesName: this.orderVarietiesName,
        supplyOrderDeliverIds: this.supplyOrderDeliverIds
      };
      this.$store.dispatch(this.orderVarietiesDateilUrl, data).then(res => {
        if (res.status === 0) {
          const selectList = [];
          const supplyOrderDetails = res.results && res.results.length ? res.results : [];
          supplyOrderDetails.forEach(item => {
            this.$set(item, 'demandPlanDetailId', item.eId);
            this.$set(item, 'eId', item.supplyOrderDeliverDetailId);
            item.rowKey = `${item.eId}-${item.varietiesId}`;
            item.arrivalTotalQuantity = item.alreadyApplyQuantity;
            item.currentArrivalQuantity = item.supplyOrderShippedQuantity;
            item.checkPassedQuantity = item.supplyOrderDeliverQuantity;
            const index = this.selectList.findIndex(v => `${v.eId}-${v.varietiesId}` === item.rowKey);
            if (index >= 0) {
              selectList.push(item);
            }
          });
          this.orderMainTable.tableData = supplyOrderDetails;
          this.orderMainTable.selectedList = selectList;
        } else {
          this.$message.error(this.$t(`exception.${res.errorCode}`));
        }
        this.loading = false;
      }).catch(e => {
        console.log(e, 'e');
        this.loading = false;
      });
    },
    // 获取选中的明细
    getTableSeleList (val) {
      this.tableCheckData = this.$clone(val);
      // const dataList = this.tableCheckData.concat(this.tableHistoryCheckData).concat(this.tableOrderData);
      // for (const item of dataList) {
      //   const index = this.selectMainTable.tableData.findIndex(val => val.rowKey === item.rowKey);
      //   item.sort = index >= 0 ? this.selectMainTable.tableData[index].sort : 0;
      // }
      // this.selectMainTable.tableData = dataList.sort(this.compare);
      this.getSelectMainTable();
    },
    getHistoryTableSeleList (val) {
      this.tableHistoryCheckData = this.$clone(val);
      // const dataList = this.tableCheckData.concat(this.tableHistoryCheckData).concat(this.tableOrderData);
      // for (const item of dataList) {
      //   const index = this.selectMainTable.tableData.findIndex(val => val.rowKey === item.rowKey);
      //   item.sort = index >= 0 ? this.selectMainTable.tableData[index].sort : 0;
      // }
      // this.selectMainTable.tableData = dataList.sort(this.compare);
      this.getSelectMainTable();
    },
    getOrderTableSeleList (val) {
      this.tableOrderData = this.$clone(val);
      // const dataList = this.tableCheckData.concat(this.tableHistoryCheckData).concat(this.tableOrderData);
      // for (const item of dataList) {
      //   const index = this.selectMainTable.tableData.findIndex(val => val.rowKey === item.rowKey);
      //   item.sort = index >= 0 ? this.selectMainTable.tableData[index].sort : 0;
      // }
      // this.selectMainTable.tableData = dataList.sort(this.compare);
      this.getSelectMainTable();
    },
    getSelectMainTable () {
      const dataList = this.tableCheckData.concat(this.tableHistoryCheckData).concat(this.tableOrderData);
      for (const item of dataList) {
        const index = this.selectMainTable.tableData.findIndex(val => val.rowKey === item.rowKey);
        item.sort = index >= 0 ? this.selectMainTable.tableData[index].sort : 0;
      }
      const list = dataList.sort(this.compare);
      const arr = [];
      for (const item of list) {
        if (!arr.some(v => `${v.eId}-${v.varietiesId}` === `${item.eId}-${item.varietiesId}`)) {
          arr.push(item);
        }
      }
      this.selectMainTable.tableData = this.$clone(arr);
    },
    // 搜索
    sysHandleSearch () {
      this.getVarietiesDateilList();
    },
    // 搜索
    historySysHandleSearch () {
      this.getHistoryVarietiesDateilList();
    },
    // 排序 比较大小
    compare (obj1, obj2) {
      const val1 = obj1.sort;
      const val2 = obj2.sort;
      if (val1 < val2) {
        return 1;
      } else if (val1 > val2) {
        return -1;
      } else {
        return 0;
      }
    },
    // 传出
    handleDialogStatus (status) {
      if (status === 'close') {
        this.$emit('update:close', false);
      } else {
        this.$emit('getData', this.selectMainTable.tableData);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.search-cons {
  margin-bottom: 4px;
}
.materialVarieties {
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  .materialVarieties-cont {
    width: 100%;
    display: flex;
    .left {
      flex: 5;
      max-width: 50%;
      margin-right: 20px;
      .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 10px 0;
        .title-name {
          width: 40%;
          min-width: 100px;
        }
      }
      .content {
        position: relative;
        width: 100%;
      }
    }
    .right {
      flex: 5;
      max-width: 50%;
      .title {
        align-items: center;
        height: 36px;
        margin: 10px 0;
      }
    }
  }
}
.treeTitle {
  height: 40px;
  width: calc(100% - 2px);
  display: flex;
  border: 1px solid #ebeef5;
  background: #fafafa;
  line-height: 40px;
  color: #909399;
  text-align: left;
  font-size: 14px;
  font-weight: bold;
  .varietiesName {
    width: calc(100% - 280px);
    padding-left: 10px;
    box-sizing: border-box;
  }
  .varietiesCode {
    width: 100px;
  }
  .standards {
    width: 100px;
  }
  .unit {
    width: 80px;
  }
}
.treeCons {
  flex: 1;
  width: calc(100% - 2px);
  position: relative;
  // background: pink;
  border: 1px solid #ebeef5;
  border-top: 0;
  /deep/ .el-tree-node__content {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #ebeef5;
  }
  .custom-tree-node {
    width: 100%;
    height: 100%;
    .tree-node {
      width: 100%;
      flex-direction: row;
      height: 100%;
      text-align: left;
      .varietiesName {
        float: left;
        height: 100%;
        width: calc(100% - 280px);
      }
      .varietiesCode {
        width: 100px;
        height: 100%;
        float: left;
      }
      .standards {
        width: 100px;
        height: 100%;
        float: left;
      }
      .unit {
        width: 80px;
        height: 100%;
        float: left;
      }
    }
  }
}
.imgUrlList {
  display: inline-block;
  vertical-align: top;
  overflow: hidden;
}
</style>
