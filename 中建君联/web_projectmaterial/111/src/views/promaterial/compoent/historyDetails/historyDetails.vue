<template>
  <div class="materialVarieties">
    <div class="materialVarieties-cont">
      <div class="left" v-loading="loading" :element-loading-text="$t('tips.loadingText')">
        <el-tabs v-model="activeName">
          <el-tab-pane :label="$t(varietiesTitle)" name="second">
            <div class="title">
              <el-input v-model.trim="varietiesName" prefix-icon="el-icon-search"
                :placeholder="$t('tips.varietiesNameTips')" size="small" clearable @keyup.enter.native="sysHandleSearch"
                maxlength="64"></el-input>
            </div>
            <div class="cons-table-t content" :style="{height: `${dialogHeight - 195}px`}">
              <div class="fixed-scroll" style="display: flex;flex-direction: column;">
                <div class="treeTitle">
                  <div v-for="item in mainTable.tableList" :key="item.prop" :class="item.prop">
                    {{$t(item.label)}}
                  </div>
                </div>
                <div class="treeCons">
                  <div class="fixed-scroll">
                    <el-tree :data="mainTable.tableData" ref="tree" node-key="rowKey" :props='props'
                      class="tree-content" :filter-node-method="filterNode" :default-checked-keys="selectId"
                      @node-click="handleNodeCheckChange">
                      <template slot="empty">
                        <no-data>
                        </no-data>
                      </template>
                      <div class="custom-tree-node" slot-scope="{ node, data }" :class="getRowClassName(data)">
                        <div class="tree-node" v-if="node.level === 1">
                          <div class="varietiesName" style="width: 100%;">
                            <tooltips :value="`${data.demandPlanTypeValue} / ${data.applyType} / ${data.createByName} / ${data.mainDemandDetail}`">
                            </tooltips>
                            <!-- 全选 -->
                            <span v-if="selectAll" class="midFont set" @click="handleSelectAll(data, 'handleNodeCheckChange')">{{$t('fConfig.selectAll')}}</span>
                          </div>
                        </div>
                        <div class="tree-node" v-else>
                          <div class="varietiesName">
                            <el-checkbox
                              v-if='data.disabled'
                              disabled
                              class="el-checkbox-varietiesName"
                            >
                            </el-checkbox>
                            <tooltips :value="data.executeVarietiesName">
                            </tooltips>
                          </div>
                          <div class="varietiesCode">
                            <tooltips :value="data.varietiesCode">
                            </tooltips>
                          </div>
                          <div class="standards">
                            <tooltips :value="data.executeStandards">
                            </tooltips>
                          </div>
                          <div class="models">
                            <tooltips :value="data.models">
                            </tooltips>
                          </div>
                          <div class="brand">
                            <tooltips :value="data.brand">
                            </tooltips>
                          </div>
                          <div class="unit">
                            <tooltips :value="data.executeUnit">
                            </tooltips>
                          </div>
                          <div class="currentApplyQuantity">
                            <tooltips :value="data.currentApplyQuantity">
                            </tooltips>
                          </div>
                        </div>
                      </div>
                    </el-tree>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <!-- 历史数据 -->
          <el-tab-pane :label="$t(historyVarietiesTitle)" name="first">
            <div class="title">
              <el-input v-model.trim="historyVarietiesName" prefix-icon="el-icon-search"
                :placeholder="$t('tips.varietiesNameTips')" size="small" clearable
                @keyup.enter.native="historySysHandleSearch" maxlength="64"></el-input>
            </div>
            <div class="cons-table-t content" :style="{height: `${dialogHeight - 195}px`}">
              <div class="fixed-scroll" style="display: flex;flex-direction: column;">
                <div class="treeTitle">
                  <div v-for="item in historyMainTable.tableList" :key="item.prop" :class="item.prop">
                    {{$t(item.label)}}
                  </div>
                </div>
                <div class="treeCons">
                  <div class="fixed-scroll">
                    <el-tree :data="historyMainTable.tableData" ref="historyTree" node-key="rowKey" :props='props'
                      class="tree-content" :filter-node-method="filterNode" :default-checked-keys="selectHistoryId"
                      @node-click="historyHandleNodeCheckChange">
                      <template slot="empty">
                        <no-data>
                        </no-data>
                      </template>
                      <div class="custom-tree-node" slot-scope="{ node, data }" :class="getRowClassName(data)">
                        <div class="tree-node" v-if="node.level === 1">
                          <div class="varietiesName" style="width: 100%;">
                            <tooltips :value="`${data.demandPlanTypeValue} / ${data.applyType} / ${data.createByName} / ${data.mainDemandDetail}`">
                            </tooltips>
                            <!-- 全选 -->
                            <span v-if="selectAll" class="midFont set" @click="handleSelectAll(data, 'historyHandleNodeCheckChange')">{{$t('fConfig.selectAll')}}</span>
                          </div>
                        </div>
                        <div class="tree-node" v-else>
                          <div class="varietiesName">
                            <tooltips :value="data.executeVarietiesName">
                            </tooltips>
                          </div>
                          <div class="varietiesCode">
                            <tooltips :value="data.varietiesCode">
                            </tooltips>
                          </div>
                          <div class="standards">
                            <tooltips :value="data.executeStandards">
                            </tooltips>
                          </div>
                          <div class="models">
                            <tooltips :value="data.models">
                            </tooltips>
                          </div>
                          <div class="brand">
                            <tooltips :value="data.brand">
                            </tooltips>
                          </div>
                          <div class="unit">
                            <tooltips :value="data.executeUnit">
                            </tooltips>
                          </div>
                          <div class="currentApplyQuantity">
                            <tooltips :value="data.currentApplyQuantity">
                            </tooltips>
                          </div>
                        </div>
                      </div>
                    </el-tree>
                  </div>
                </div>
              </div>
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
  name: 'historyDetails',
  mixins: [search],
  data () {
    return {
      loading: false,
      activeName: 'second',
      props: {
        label: 'executeVarietiesName',
        children: 'children',
        isLeaf: 'leaf'
      },
      mainTable: {
        // 表格数据
        tableData: [],
        // 子系统表头渲染参数
        tableList: [
          // 材料品种名称
          { show: true, prop: 'executeVarietiesName', label: 'fConfig.varietiesName' },
          // 材料品种编码
          { show: true, prop: 'varietiesCode', label: 'fConfig.varietiesCode' },
          // 规格
          { show: true, prop: 'executeStandards', label: 'fConfig.standards' },
          // 型号
          { show: true, prop: 'models', label: 'fConfig.models' },
          // 品牌
          { show: true, prop: 'brand', label: 'fConfig.brand' },
          // 单位
          { show: true, prop: 'executeUnit', label: 'fConfig.unit' },
          // 数量
          { show: true, prop: 'currentApplyQuantity', label: 'fConfig.quantity', minWidth: '60' }
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
          { show: true, prop: 'executeVarietiesName', label: 'fConfig.varietiesName' },
          // 规格
          { show: true, prop: 'executeStandards', label: 'fConfig.standards', minWidth: '100' },
          // 型号
          { show: true, prop: 'models', label: 'fConfig.models', minWidth: '60' },
          // 品牌
          { show: true, prop: 'brand', label: 'fConfig.brand', minWidth: '60' },
          // 单位
          { show: true, prop: 'executeUnit', label: 'fConfig.unit', minWidth: '60' },
          // // 数量
          // { show: true, prop: 'currentApplyQuantity', label: 'fConfig.quantity', minWidth: '60' },
          // 操作
          {show: true, prop: 'operate', formType: 'operate', label: 'fConfig.operate', minWidth: '80',
            buts: [
              {name: 'button.delete', class: 'danger', fn: 'handleDelete', authCode: 'delete', noAuth: true}
            ]
          }
        ]
      },
      historyMainTable: {
        rowKey: 'rowKey',
        // 表格数据
        tableData: [],
        // 表格高度
        maxHeight: 500,
        // 子系统表头渲染参数
        tableList: [
          // 材料品种名称
          { show: true, prop: 'executeVarietiesName', label: 'fConfig.varietiesName' },
          // 材料品种编码
          { show: true, prop: 'varietiesCode', label: 'fConfig.varietiesCode' },
          // 规格
          { show: true, prop: 'executeStandards', label: 'fConfig.standards' },
          // 型号
          { show: true, prop: 'models', label: 'fConfig.models' },
          // 品牌
          { show: true, prop: 'brand', label: 'fConfig.brand' },
          // 单位
          { show: true, prop: 'executeUnit', label: 'fConfig.unit' },
          // 数量
          { show: true, prop: 'currentApplyQuantity', label: 'fConfig.quantity', minWidth: '60' }
        ]
      },
      varietiesName: '',
      historyVarietiesName: '',
      // =====================
      tableSeleList: [],
      varietiesDateilUrl: '',
      historyVarietiesDateilUrl: '',
      selectId: [],
      selectHistoryId: [],
      guids: '',
      selectAll: false
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
    // 历史数据的标题
    historyVarietiesTitle: {
      type: String,
      default: 'fConfig.historicalDemandPlan' // 采购计划 : 历史需求计划
    },
    // 采购
    promaterialTtype: {
      type: String,
      default: 'purchas' // purchas 采购计划 sporadic 零星采购 order 订单
    },
    // 选中的品种
    selectList: {
      default: []
    },
    projectId: {
      default: 0
    }
  },
  async created () {
    this.selectMainTable.maxHeight = this.dialogHeight - 140;
    this.historyMainTable.maxHeight = this.dialogHeight - 200;
    this.mainTable.maxHeight = this.dialogHeight - 200;
    if (this.promaterialTtype === 'purchas') {
      this.varietiesDateilUrl = 'promaterialPurchaseApply/getDemandPurchaseApply';
      this.historyVarietiesDateilUrl = 'promaterialPurchaseApply/getHistoryDemandPurchaseApply';
      this.selectAll = false;
    }
    if (this.promaterialTtype === 'sporadic') {
      this.varietiesDateilUrl = 'sporadicPurchase/getSporadic';
      this.historyVarietiesDateilUrl = 'sporadicPurchase/getHistoryDemandPurchaseApply';
      this.selectAll = true;
    }
    const selectList = this.$clone(this.selectList);
    selectList.forEach((item, index) => {
      item.rowKey = `${item.demandPlanTypeCode}-${item.demandPlanId}-${item.varietiesId}-${this.selectMainTable.tableData.length + 1}`;
      item.sort = selectList.length - index;
      this.selectMainTable.tableData.push(item);
    });
    this.getVarietiesDateilList();
  },
  methods: {
    getRowClassName(row) {
      // console.log(row, 'row');
      // console.log(this.selectMainTable.tableData, 'this.selectMainTable.tableData');
      const index = this.selectMainTable.tableData.findIndex(v => v.varietiesId === row.varietiesId &&
      (v.demandPlanCode === row.demandPlanCode || v.demandPlanTypeCode === row.demandPlanTypeCode));
      return index >= 0 ? 'selected' : '';
    },
    // 获取材料明细 /demand/month/purchase/apply/plan
    getVarietiesDateilList () {
      this.loading = true;
      const data = {
        projectId: this.projectId,
        varietiesName: this.varietiesName
      };
      this.$store.dispatch(this.varietiesDateilUrl, data).then(res => {
        if (res.status === 0) {
          const selectList = [];
          const selectIds = [];
          for (const item of this.selectList) {
            selectIds.push(`${item.demandPlanTypeCode}-${item.demandPlanId}-${item.varietiesId}`);
          }
          this.selectId = selectIds; // 默认勾选
          res.results.forEach(item => {
            item.demandPlanTypeCode === '02' &&
              (item.applyType = `${item.applyType.substr(0, item.applyType.length - 1)}/${item.applyType.substr(item.applyType.length - 1, 1)}`);
              for (const child of item.demandPlanSummaryDetailResultDtos) {
                child.demandPlanCode = child.docNo;
                const num = Number(child.currentApplyQuantity - child.applyTotalQuantity - child.supplyOutboundQuantity).toFixed(4);
                this.$set(child, 'disabled', num <= 0);
              }
            item.children = this.$clone(item.demandPlanSummaryDetailResultDtos);
          });
          this.mainTable.tableData = res.results;
          this.getHistoryVarietiesDateilList();
          if (!this.mainTable.tableData.length) {
            this.$message.warning(this.$t('tips.varietiesMasterPlanDataNull'));
          }
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
        varietiesName: this.historyVarietiesName
      };
      this.$store.dispatch(this.historyVarietiesDateilUrl, data).then(res => {
        if (res.status === 0) {
          const selectList = [];
          const selectIds = [];
          for (const item of this.selectList) {
            selectIds.push(`${item.demandPlanTypeCode}-${item.demandPlanId}-${item.varietiesId}`);
          }
          this.selectHistoryId = selectIds; // 默认勾选
          res.results.forEach(item => {
            item.demandPlanTypeCode === '02' &&
              (item.applyType = `${item.applyType.substr(0, item.applyType.length - 1)}/${item.applyType.substr(item.applyType.length - 1, 1)}`);
              for (const child of item.demandPlanSummaryDetailResultDtos) {
                child.demandPlanCode = child.docNo;
              }
            item.children = this.$clone(item.demandPlanSummaryDetailResultDtos);
          });
          this.selectHistoryId = selectIds;
          this.historyMainTable.tableData = res.results;
        } else {
          this.$message.error(this.$t(`exception.${res.errorCode}`));
        }
        this.loading = false;
      }).catch(e => {
        this.loading = false;
      });
    },
    // 搜索
    sysHandleSearch () {
      this.$refs.tree.filter(this.varietiesName);
    },
    // 条件过滤
    filterNode (value, data) {
      if (!value) return true;
      const code = `${data.varietiesCode}${data.executeVarietiesName}${data.executeStandards}${data.executeUnit}`;
      return code.indexOf(value) !== -1;
    },
    // 全选
    handleSelectAll(data, funType) {
      if (data.children && data.children.length) {
        const list = data.children.filter(v => !v.disabled);
        for (const item of list) {
          this[funType](item);
        }
      }
    },
    // 点击行
    handleNodeCheckChange (data, node) {
      if (node && node.disabled) {
        // 已下单数量大于报量数量！
        return this.$message.error(`${this.$t('dialog.exceedTips')}`);
      }
      const arr = this.$clone(data);
      if (arr.varietiesId) {
        arr.isNew = true;
        arr.rowKey = `${arr.varietiesId}-${this.selectMainTable.tableData.length + 1}`;
        this.selectMainTable.tableData.push(arr);
      } else {
        this.selectMainTable.tableData;
      }
    },
    // 点击行
    historyHandleNodeCheckChange (data, node) {
      const arr = this.$clone(data);
      if (arr.varietiesId) {
        arr.isNew = true;
        arr.rowKey = `${arr.varietiesId}-${this.selectMainTable.tableData.length + 1}`;
        this.selectMainTable.tableData.push(arr);
      } else {
        this.selectMainTable.tableData;
      }
    },
    // 搜索
    historySysHandleSearch () {
      this.$refs.historyTree.filter(this.historyVarietiesName);
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
      this.$confirm(`${this.$t('button.delete')} ${row.executeVarietiesName}?`, this.$t('button.delete'), {
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
      flex: 6;
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
      flex: 4;
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
    width: calc(100% - 500px);
    padding-left: 10px;
    box-sizing: border-box;
  }
  .executeVarietiesName{
    width: calc(100% - 500px);
    padding-left: 10px;
    box-sizing: border-box;
  }
  .varietiesCode {
    width: 100px;
  }
  .standards {
    width: 100px;
  }
  .executeStandards{
    width: 100px;
  }
  .models {
    width: 60px;
  }
  .brand {
    width: 60px;
  }
  .unit {
    width: 60px;
  }
  .executeUnit{
    width: 60px;
  }
  .currentApplyQuantity {
    width: 60px;
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
        width: calc(100% - 500px);
        display: flex;
        justify-content: space-between;
        padding-right: 20px;
        box-sizing: border-box;
        position: relative;
        .el-checkbox-varietiesName{
          display: inline-block;
          width: 8px;
          position: absolute;
          left: -20px;
          bottom: 2px;
        }
      }
      .executeVarietiesName{
        float: left;
        height: 100%;
        width: calc(100% - 500px);
        display: flex;
        justify-content: space-between;
        padding-right: 20px;
        box-sizing: border-box;
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
      .executeStandards{
        width: 100px;
        height: 100%;
        float: left;
      }
      .models {
        width: 60px;
        height: 100%;
        float: left;
      }
      .brand {
        width: 60px;
        height: 100%;
        float: left;
      }
      .unit {
        width: 60px;
        height: 100%;
        float: left;
      }
      .executeUnit{
        width: 60px;
        height: 100%;
        float: left;
      }
      .currentApplyQuantity {
        width: 60px;
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

/deep/ .tooltip {
  max-width: 580px;
  overflow: hidden; /*超出隐藏*/
  text-overflow: ellipsis;/*隐藏后添加省略号*/
  white-space: nowrap;/*强制不换行*/
}
</style>
