<template>
  <div class="materialVarieties">
    <div class="materialVarieties-cont">
      <div class="left" :element-loading-text="$t('tips.loadingText')">
        <el-tabs v-model="activeName">
          <el-tab-pane :label="$t(varietiesTitle)" v-loading="loading" name="second">
            <div class="title">
              <el-input v-model.trim="varietiesName" prefix-icon="el-icon-search"
                :placeholder="$t('tips.varietiesNameTips')" size="small" clearable
                @keyup.enter.native="searchTableData('search')" maxlength="64"></el-input>
            </div>
            <g-query-table :config="mainTable" ref="mainTable" @rowClick="getTableSeleList"  :getRowClassName="getTableRowClassName">
            </g-query-table>
            <div class="table_pages">
              <g-to-page ref="PageVarieties" :page-size="pageSize" :total="total" @sentPages="getPages">
              </g-to-page>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t(costVarietiesTitle)" v-if="costControlRuleCode !== '03'"  name="first">
            <div class="title">
              <el-input v-model.trim="queryParam" prefix-icon="el-icon-search"
                :placeholder="$t('tips.varietiesNameTips')" size="small" clearable @keyup.enter.native="sysHandleSearch"
                maxlength="64"></el-input>
            </div>
            <div class="cons-table-t content" :style="{height: `${dialogHeight - 240}px`}"  v-loading="loadingCost">
              <div class="fixed-scroll fixed-scroll-first" style="display: flex;flex-direction: column; top: '60px';">
                <div class="treeTitle">
                  <div v-for="item in costMainTable.tableList" :key="item.prop" :class="item.prop">
                    {{$t(item.label)}}
                  </div>
                </div>
                <div class="treeCons" v-if="!loading">
                  <div class="fixed-scroll">
                    <el-tree :data="costMainTable.tableData" ref="tree" node-key="rowKey" :props='props'
                      class="tree-content"
                      @node-click="handleNodeCheckChange">
                      <template slot="empty">
                        <no-data>
                        </no-data>
                      </template>
                      <div class="custom-tree-node" slot-scope="{ node, data }" :style='{color: getRowClassName(data)}'>
                        <div class="tree-node" v-if="node.level === 1">
                          <div class="varietiesName" style="width: 100%;">
                            <tooltips :value="`${data.docNo}-${data.projectDetailName}-${data.projectDetailCode}`">
                            </tooltips>
                          </div>
                        </div>
                        <div class="tree-node" v-else>
                          <div class="varietiesName">
                            <tooltips :value="data.varietiesName">
                            </tooltips>
                          </div>
                          <div class="standards">
                            <tooltips :value="data.standards">
                            </tooltips>
                          </div>
                          <div class="unit">
                            <tooltips :value="data.unit">
                            </tooltips>
                          </div>
                          <div class="controlQuantity">
                            <tooltips :value="data.controlQuantity">
                            </tooltips>
                          </div>
                          <div class="controlUnitPrice">
                            <tooltips :value="data.controlUnitPrice">
                            </tooltips>
                          </div>
                          <div class="controlTotalAmount">
                            <tooltips :value="data.controlTotalAmount">
                            </tooltips>
                          </div>
                        </div>
                      </div>
                    </el-tree>
                  </div>
                </div>
              </div>
            </div>
            <div class="table_pages">
                <g-to-page ref="Page" :page-size="pageSizeCost" :total="totalCost" @sentPages="getPagesCost">
                </g-to-page>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="right">
        <div class="title">{{$t('tips.selected')}}</div>
        <g-query-table :config="selectMainTable" @fnName="pageConfigEmitQueryTableButtonFnName">
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
  name: 'purchaseDetials',
  mixins: [search],
  data () {
    return {
      loading: false,
      mainTable: {
        rowKey: 'rowKey',
        // 多选
        isCheckbox: false,
        selectedList: [],
        // 表格数据
        tableData: [],
        // 表格高度
        maxHeight: 500,
        // 子系统表头渲染参数
        tableList: [
          // 材料品种编码
          { show: true, prop: 'varietiesCode', label: 'fConfig.varietiesCode', minWidth: '120' },
          // 材料品种名称
          { show: true, prop: 'varietiesName', label: 'fConfig.varietiesName' },
          // 规格
          { show: true, prop: 'standards', label: 'fConfig.standards', minWidth: '100' },
          // 单位
          { show: true, prop: 'unit', label: 'fConfig.unit', minWidth: '60' }
        ]
      },
      props: {
        label: 'varietiesName',
        children: 'children',
        isLeaf: 'leaf'
      },
      costMainTable: {
        rowKey: 'rowKey',
        // 表格数据
        tableData: [],
        // 子系统表头渲染参数
        tableList: [
          // 材料品种名称
          { show: true, prop: 'varietiesName', label: 'fConfig.varietiesName' },
          // 规格
          { show: true, prop: 'standards', label: 'fConfig.standards' },
          // 单位
          { show: true, prop: 'unit', label: 'fConfig.unit' },
          // 成控数量 ,
          { show: true, prop: 'controlQuantity', label: 'dialog.controlQuantity'},
          // 成控单价
          { show: true, prop: 'controlUnitPrice', label: 'dialog.controlUnitPrice'},
          // 成控合价
          { show: true, prop: 'controlTotalAmount', label: 'dialog.controlTotalAmount'}
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
          // 材料品种编码
          { show: true, prop: 'varietiesCode', label: 'fConfig.varietiesCode', minWidth: '120' },
          // 材料品种名称
          { show: true, prop: 'varietiesName', label: 'fConfig.varietiesName' },
          // 规格
          { show: true, prop: 'standards', label: 'fConfig.standards', minWidth: '100' },
          // 单位
          { show: true, prop: 'unit', label: 'fConfig.unit', minWidth: '60' },
          // 操作
          {show: true, prop: 'operate', formType: 'operate', label: 'fConfig.operate', minWidth: '80',
            buts: [
              {name: 'button.delete', class: 'danger', fn: 'handleDelete', authCode: 'delete', noAuth: true}
            ]
          }
        ]
      },
      varietiesName: '',
      // =====================
      pageNo: 1,
      pageSize: 100,
      total: 0,
      pageNoCost: 1,
      pageSizeCost: 100,
      totalCost: 0,
      activeName: 'second',
      queryParam: '',
      loadingCost: false,
      costTableSeleList: [],
      selectTreeId: [],
      defaultExpandedKeysTree: []
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
    costVarietiesTitle: {
      type: String,
      default: 'promaterialPurchaseApply.costVarietiesTitle'
    },
    selectList: {
      default: () => []
    },
    projectId: {
      default: 0
    },
    costControlRuleCode: {
      default: ''
    }
  },
  created () {
    // this.searchTableData();
    this.selectMainTable.maxHeight = this.dialogHeight - 140;
    this.costMainTable.maxHeight = this.dialogHeight - 296;
    this.mainTable.maxHeight = this.dialogHeight - 260;
    const selectList = this.$clone(this.selectList);
    selectList.forEach((item, index) => {
      item.sort = selectList.length - index;
      this.$set(item, 'rowKey', `${item.demandPlanTypeCode}-${item.eId}`);
      this.selectMainTable.tableData.push(item);
    });
    this._getTableDataList('');
    if (this.costControlRuleCode !== '03') {
      this.getVarietiesDateilList();
    }
  },
  methods: {
    async searchTableData (type = '') {
      this.$refs.PageVarieties && this.$refs.PageVarieties.setCurrentPage();
      // await this._getTableDataList(type);
    },
    // 分页
    getPages (obj) {
      if (obj.isSzieChange) {
        this.pageSize = obj.pageSize;
      } else {
        this.pageNo = obj.pageNo;
      }
      this._getTableDataList();
    },
    // 施工总预算
    _getTableDataList (type) {
      this.loading = true;
      const data = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        projectId: this.projectId,
        varietiesName: this.varietiesName
      };
      this.$store.dispatch('promaterialPurchaseApply/getDemandVarieties', data).then(res => {
        if (res.status === 0) {
          res.results.records.forEach(item => {
            item.demandPlanTypeCode = '04';
            item.rowKey = `${item.demandPlanTypeCode}-${item.id}`;
            item.demandPlanTypeValue = '总预算';
            item.demandPlanId = item.masterPlanId;
            item.currentApplyQuantity = item.changeAfterQuantity;
            item.applyTotalQuantity = item.applyQuantity;
            this.$set(item, 'budgetTotalAmount', item.changeAfterAmount);
            this.$set(item, 'budgetUnitPrice', item.changeAfterUnitPrice);
            this.$set(item, 'budgetQuantity', item.changeAfterQuantity);
            this.$set(item, 'executeStandards', item.standards);
            this.$set(item, 'executeUnit', item.unit);
            this.$set(item, 'executeVarietiesName', item.varietiesName);
            this.$set(item, 'eId', item.id);
          });
          this.mainTable.tableData = res.results.records;
          this.total = res.results.total;
          if (!this.mainTable.tableData.length && this.pageNo === 1) {
            this.$message.warning(`${this.$t('tips.detailTips')}${this.$t(this.varietiesTitle)}`);
          }
        } else {
          this.$message.error(this.$t(`exception.${res.errorCode}`));
        }
        this.loading = false;
      }).catch(e => {
        this.loading = false;
      });
    },
    // 分页
    getPagesCost (obj) {
      if (obj.isSzieChange) {
        this.pageSizeCost = obj.pageSize;
      } else {
        this.pageNoCost = obj.pageNo;
      }
      this.getVarietiesDateilList();
    },
    // 搜索
    sysHandleSearch () {
      this.pageNo = 1;
      this.getVarietiesDateilList();
    },
    // 目标成本
    getVarietiesDateilList () {
      this.loadingCost = true;
      const data = {
        costTypeCodes: ['02'],
        docNo: '',
        pageNo: this.pageNoCost,
        pageSize: this.pageSizeCost,
        queryParam: this.queryParam,
        projectId: this.projectId
      };
      this.$store.dispatch('masterPlan/getProcostMasterDetail', data).then(res => {
        if (res.status === 0) {
          const results = res.results.records || [];
          for (const item of results) {
            this.$set(item, 'rowKey', `${item.docNo}-${item.id}`);
            item.children = this.$clone(item.details);
            for (const children of item.children) {
                this.$set(children, 'demandPlanTypeCode', '05');
                this.$set(children, 'demandPlanTypeValue', '目标成本分解');
                this.$set(children, 'applyTotalQuantity', children.alreadyPurchaseApplyQuantity);
                this.$set(children, 'varietiesName', children.materialName);
                this.$set(children, 'standards', children.features);
                this.$set(children, 'controlQuantity', children.quantity);
                this.$set(children, 'controlUnitPrice', children.unitPrice);
                this.$set(children, 'controlTotalAmount', children.totalPrice);
                this.$set(children, 'bidTotalAmount', children.bidTotalPrice);
                this.$set(children, 'projectDetailCode', item.projectDetailCode);
                this.$set(children, 'projectDetailName', item.projectDetailName);
                this.$set(children, 'executeStandards', children.standards);
                this.$set(children, 'executeUnit', children.unit);
                this.$set(children, 'executeVarietiesName', children.varietiesName);
                this.$set(children, 'eId', children.id);
                this.$set(children, 'rowKey', `${children.demandPlanTypeCode}-${children.id}`);
            }
          }
          this.costMainTable.tableData = results;
          this.totalCost = res.results.total;
        } else {
          this.$message.error(this.$t(`exception.${res.errorCode}`));
        }
        this.loadingCost = false;
      }).catch(e => {
        console.log(e, 'e');
        this.loadingCost = false;
      });
    },
    // 点击行
    handleNodeCheckChange (data, node) {
      if (data.demandPlanTypeCode) {
        this.$set(data, 'sort', this.selectMainTable.tableData.length + 1);
        this.$set(data, 'isNew', true);
        this.selectMainTable.tableData.push(data);
      }
    },
    // 勾选
    getTableSeleList (val) {
      const data = this.$clone(val);
      data.isNew = true;
      data.rowKey = `${data.varietiesId}-${this.selectMainTable.tableData.length + 1}`;
      this.selectMainTable.tableData.push(data);
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
    // 删除
    handleDelete(row) {
      this.$confirm(`${this.$t('button.delete')} ${row.varietiesName}?`, this.$t('button.delete'), {
        confirmButtonText: this.$t('button.determine'),
        cancelButtonText: this.$t('button.close'),
        type: 'warning'
      }).then(() => {
          this.selectMainTable.tableData.splice(this.selectMainTable.tableData.indexOf(row), 1);
      }).catch(() => { });
    },
    // 传出
    handleDialogStatus (status) {
      if (status === 'close') {
        this.$emit('update:close', false);
      } else {
        this.$emit('getData', this.selectMainTable.tableData);
      }
    },
    // 策划明细
    getTableRowClassName({row, rowIndex}) {
      row.rowKey = `${row.demandPlanTypeCode}-${row.eId}`;
      const index = this.selectMainTable.tableData.findIndex(v => `${v.demandPlanTypeCode}-${v.eId}` === row.rowKey);
      return index >= 0 ? 'selected' : '';
    },
    // 策划明细目标成本测算-材料明细
    getRowClassName(row) {
      row.rowKey = `${row.demandPlanTypeCode}-${row.eId}`;
      const index = this.selectMainTable.tableData.findIndex(v => `${v.demandPlanTypeCode}-${v.eId}` === row.rowKey);
      return index >= 0 ? 'red' : '';
    }
  }
};
</script>

<style scoped lang="scss">
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
          min-width: 100px;
          width: 40%;
        }
      }
      .table_pages {
        text-align: center;
        margin-top: 10px;
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
  /deep/ tbody{
    tr {
      &.selected {
        color: red;
      }
    }
  }
}
.cons {
  background-color: #fff;
  color: #303133;
  padding: 10px;
  transition: 0.3s;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
  position: relative;
  .content {
    position: relative;
    width: 100%;
  }
}
.fixed-scroll-first {
  position: absolute;
  left: 0;
  top: 62px!important;
  right: 0;
  bottom: 0;
  overflow-y: auto
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
    width: calc(100% - 400px);
    padding-left: 10px;
    box-sizing: border-box;
  }
  .standards {
    width: 100px;
  }
  .unit {
    width: 60px;
  }
  .controlQuantity {
    width: 80px;
  }
  .controlUnitPrice {
    width: 80px;
  }
  .controlTotalAmount {
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
    &.selected {
      color: red;
    }
    .tree-node {
      width: 100%;
      flex-direction: row;
      height: 100%;
      text-align: left;
      .varietiesName {
        float: left;
        height: 100%;
        width: calc(100% - 400px);
      }
      .standards {
        width: 100px;
        height: 100%;
        float: left;
      }
      .unit {
        width: 60px;
        height: 100%;
        float: left;
      }
      .controlQuantity {
        width: 80px;
        height: 100%;
        float: left;
      }
      .controlUnitPrice {
        width: 80px;
        height: 100%;
        float: left;
      }
      .controlTotalAmount {
        width: 80px;
        height: 100%;
        float: left;
      }
    }
  }
}
</style>
