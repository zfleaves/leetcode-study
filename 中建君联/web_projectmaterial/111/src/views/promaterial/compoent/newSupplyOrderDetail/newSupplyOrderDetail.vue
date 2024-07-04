<!--
 * @Author: your name
 * @Date: 2021-03-26 11:19:33
 * @LastEditTime: 2022-11-11 16:10:50
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial-项目材料管理\src\views\promaterial\compoent\newSupplyOrderDetail\newSupplyOrderDetail.vue
-->
<template>
  <div class="materialVarieties">
    <div class="materialVarieties-cont">
      <div class="left" :element-loading-text="$t('tips.loadingText')">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane  v-loading="loading" :label="$t(varietiesTitle)" name="second" @tab-click="handleClick">
            <div class="cons">
              <div class="search-cons">
                <el-input v-model.trim="varietiesName" prefix-icon="el-icon-search"
                  :placeholder="$t('tips.varietiesNameTips')" size="small" clearable
                  @keyup.enter.native="sysHandleSearch" maxlength="64">
                </el-input>
              </div>
              <div class="cons-table-t content" :style="{height: `${dialogHeight - 140 - 40}px`}">
                <div class="fixed-scroll" style="display: flex;flex-direction: column;">
                  <div class="treeTitle">
                    <div v-for="item in mainTable.tableList" :key="item.prop" :class="item.prop">
                      {{$t(item.label)}}
                    </div>
                  </div>
                  <div class="treeCons">
                    <div class="fixed-scroll">
                      <el-tree :data="mainTable.tableData" ref="tree" node-key="rowKey" :props='props'
                        class="tree-content" :default-expanded-keys="[1]" :filter-node-method="filterNode"
                        :default-checked-keys="selectId" @node-click="handleNodeCheckChange">
                        <template slot="empty">
                          <no-data>
                          </no-data>
                        </template>
                        <div class="custom-tree-node" slot-scope="{ node, data }" :class="getRowClassName(data)">
                          <div class="tree-node" v-if="node.level === 1">
                            <div class="firstRowVarietiesName" style="width: 100%; max-width: 100%">
                              <tooltips :value="`${data.demandPlanTypeValue} - ${data.applyType} / ${data.createByName || ''} / ${data.docNo} / ${data.mainDemandDetail || ''}`">
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
                              <tooltips :value="data.executeStandards" :title="data.executeStandards">
                              </tooltips>
                            </div>
                            <div class="models">
                              <tooltips :value="data.models" :title="data.models">
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
                            <div class="unitPrice">
                              <tooltips :value="data.unitPrice">
                              </tooltips>
                            </div>
                            <div class="alreadyApplyQuantity">
                              <tooltips :value="data.alreadyApplyQuantity">
                              </tooltips>
                            </div>
                            <div class="quantitiesName">
                              <tooltips :value="costControlRuleCode === '02' ? data.expenseName : data.quantitiesName ">
                              </tooltips>
                            </div>
                          </div>
                        </div>
                      </el-tree>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane v-loading="loading" v-if="false" name="first">
            <span slot="label" v-if='!supplyOrderA'>{{$t('supplyOrder.contractDetail')}}
              <el-tooltip class="item" effect="dark" placement="top-start">
                <div slot="content" style="line-height: 24px;">{{$t('supplyOrder.contractDetailTips')}}
                </div>
                <i class="el-icon-question"></i>
              </el-tooltip>
            </span>
            <div class="cons">
              <div class="search-cons">
                <el-input v-model.trim="varietiesContractName" prefix-icon="el-icon-search"
                  :placeholder="$t('tips.varietiesNameTips')" size="small" clearable
                  @keyup.enter.native="sysHandleContractSearch" maxlength="64">
                </el-input>
              </div>
              <div class="cons-table-t content">
                <g-query-table :config="contractTable" ref="mainTable" @rowClick="getTableSeleList" :getRowClassName="getTableRowClassName">
                </g-query-table>
              </div>
            </div>
          </el-tab-pane>
          <!-- 历史数据 -->
          <el-tab-pane v-loading="loading" :label="$t('fConfig.historicalDemandPlan')" name="history">
            <div class="cons">
              <div class="search-cons">
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
                            <div class="firstRowVarietiesName">
                              <tooltips :value="`${data.demandPlanTypeValue} / ${data.applyType} / ${data.createByName || ''} / ${data.docNo} / ${data.mainDemandDetail || ''}`">
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
                              <tooltips :value="data.executeStandards" :title="data.executeStandards">
                              </tooltips>
                            </div>
                            <div class="models">
                              <tooltips :value="data.models" :title="data.models">
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
                            <div class="unitPrice">
                              <tooltips :value="data.unitPrice">
                              </tooltips>
                            </div>
                            <div class="alreadyApplyQuantity">
                              <tooltips :value="data.alreadyApplyQuantity">
                              </tooltips>
                            </div>
                            <div class="quantitiesName">
                              <tooltips :value="costControlRuleCode === '02' ? data.expenseName : data.quantitiesName ">
                              </tooltips>
                            </div>
                          </div>
                        </div>
                      </el-tree>
                    </div>
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
  name: 'newSupplyOrderDetail',
  mixins: [search],
  data () {
    return {
      loading: false,
      props: {
        label: 'executeVarietiesName',
        children: 'children',
        isLeaf: 'leaf'
      },
      contractTable: {
        rowKey: 'rowKey',
        // 多选
        isCheckbox: false,
        // 表格数据
        tableData: [],
        // 子系统表头渲染参数
        tableList: [
          // 材料品种名称
          { show: true, prop: 'executeVarietiesName', label: 'fConfig.varietiesName' },
          // // 材料品种编码
          { show: true, prop: 'varietiesCode', label: 'fConfig.varietiesCode', minWidth: '120' },
          // 规格, minWidth: '100'
          { show: true, prop: 'executeStandards', label: 'fConfig.standards', minWidth: '80' },
          // 型号
          { show: true, prop: 'models', label: 'fConfig.models', minWidth: '80' },
          // 单位
          { show: true, prop: 'executeUnit', label: 'fConfig.unit', minWidth: '60' },
          // 数量
          { show: true, prop: 'demandQuantity', label: 'fConfig.quantity', minWidth: '80' },
          // 单价
          { show: true, prop: 'budgetUnitPrice', label: 'fConfig.price', formType: 'setMoney', minWidth: '60' },
          // 已下单数量
          { show: true, prop: 'alreadyApplyQuantity', label: 'fConfig.alreadyApplyQuantity', minWidth: '80' },
          // 所属成本结构
          { show: true, prop: 'quantitiesName', label: 'fConfig.quantitiesName', minWidth: '100' }
        ]
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
          // 单位
          { show: true, prop: 'executeUnit', label: 'fConfig.unit' },
          // 数量
          { show: true, prop: 'currentApplyQuantity', label: 'fConfig.quantity' },
          // 暂定单价(含税)
          { show: true, prop: 'unitPrice', label: 'dialog.provisionalUnitPrice', minWidth: '60' },
          // 已下单数量
          { show: true, prop: 'alreadyApplyQuantity', label: 'fConfig.alreadyApplyQuantity', minWidth: '80' },
          // 所属成本结构
          { show: true, prop: 'quantitiesName', label: 'fConfig.quantitiesName', minWidth: '100' }
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
          { show: true, prop: 'varietiesCode', label: 'fConfig.varietiesCode', minWidth: '120' },
          // 规格
          { show: true, prop: 'executeStandards', label: 'fConfig.standards', minWidth: '100' },
          // 型号
          { show: true, prop: 'models', label: 'fConfig.models', minWidth: '100' },
          // 单位
          { show: true, prop: 'executeUnit', label: 'fConfig.unit', minWidth: '60' },
          // 数量
          { show: true, prop: 'unitPrice', label: 'fConfig.quantity' },
          // 暂定单价(含税)
          { show: true, prop: 'contractUnitPrice', label: 'dialog.provisionalUnitPrice', minWidth: '60' },
          // 已下单数量
          { show: true, prop: 'alreadyApplyQuantity', label: 'fConfig.alreadyApplyQuantity', minWidth: '80' },
          // 所属成本结构
          { show: true, prop: 'quantitiesName', label: 'fConfig.quantitiesName', minWidth: '100' }
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
          // { show: true, prop: 'varietiesCode', label: 'fConfig.varietiesCode', minWidth: '120' },
          // 材料品种名称
          { show: true, prop: 'executeVarietiesName', label: 'fConfig.varietiesName' },
          // 规格
          { show: true, prop: 'executeStandards', label: 'fConfig.standards', minWidth: '100' },
          // 单位
          { show: true, prop: 'executeUnit', label: 'fConfig.unit', minWidth: '60' },
          // 所属成本结构
          { show: true, prop: 'quantitiesName', label: 'fConfig.quantitiesName', minWidth: '100' },
          // 操作
          {show: true, prop: 'operate', formType: 'operate', label: 'fConfig.operate', minWidth: '80',
            buts: [
              {name: 'button.delete', class: 'danger', fn: 'handleDelete', authCode: 'delete', noAuth: true}
            ]
          }
        ]
      },
      varietiesContractName: '',
      varietiesName: '',
      // =====================
      tableSeleList: [],
      selectId: [],
      temTableData: [],
      activeName: 'second',
      checkList: [],
      treeCheckData: [],
      tableCheckData: [],
      historyVarietiesName: '',
      selectHistoryId: [],
      selectAll: true
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
    // 采购
    promaterialTtype: {
      type: String,
      default: 'order' // purchas 采购计划 sporadic 零星采购 order 订单
    },
    // 选中的品种
    selectList: {
      default: []
    },
    projectId: {
      default: ''
    },
    contractId: {
      default: ''
    },
    // 甲供
    supplyOrderA: {
      type: String,
      default: ''
    },
    // 成控规则
    costControlRuleCode: {
      type: String,
      default: ''
    }
  },
  async created () {
    this.selectMainTable.maxHeight = this.dialogHeight - 140;
    this.mainTable.maxHeight = this.dialogHeight - 140 - 40;
    this.contractTable.maxHeight = this.dialogHeight - 140 - 40;
    this.historyMainTable.maxHeight = this.dialogHeight - 140 - 40;
    this.contractTable.selectable = this.selectable;
    this.checkList = this.$clone(this.selectList);
    const selectList = this.$clone(this.selectList);
    selectList.forEach((item, index) => {
      if (item.contractDetailId) {
        item.rowKey = `${item.demandPlanTypeCode}-${item.demandPlanId}-${item.contractDetailId}-${this.selectMainTable.tableData.length + 1}`;
      } else {
        item.rowKey = `${item.varietiesId}-${item.demandPlanId}-${item.demandPlanTypeCode}-${this.selectMainTable.tableData.length + 1}`;
      }
      item.sort = selectList.length - index;
      this.selectMainTable.tableData.push(item);
    });
    this.changeProp();
    this.getVarietiesDateilList();
    this.getVarietiesContractDateilList();
    this.getHistoryVarietiesDateilList();
  },
  methods: {
    // 根据成控规则动态改变所属成本结构的prop
    changeProp() {
      if (this.costControlRuleCode === '02') {
        const index1 = this.contractTable.tableList.findIndex(item => item.prop === 'quantitiesName');
        const index2 = this.mainTable.tableList.findIndex(item => item.prop === 'quantitiesName');
        const index3 = this.historyMainTable.tableList.findIndex(item => item.prop === 'quantitiesName');
        const index4 = this.selectMainTable.tableList.findIndex(item => item.prop === 'quantitiesName');
        if (index1 > 0) {
          this.$set(this.contractTable.tableList[index1], 'prop', 'expenseName');
        }
        if (index2 > 0) {
          this.$set(this.mainTable.tableList[index2], 'prop', 'expenseName');
        }
        if (index3 > 0) {
          this.$set(this.historyMainTable.tableList[index3], 'prop', 'expenseName');
        }
        if (index4 > 0) {
          this.$set(this.selectMainTable.tableList[index4], 'prop', 'expenseName');
        }
      } else {
        const index1 = this.contractTable.tableList.findIndex(item => item.prop === 'expenseName');
        const index2 = this.mainTable.tableList.findIndex(item => item.prop === 'expenseName');
        const index3 = this.historyMainTable.tableList.findIndex(item => item.prop === 'expenseName');
        const index4 = this.selectMainTable.tableList.findIndex(item => item.prop === 'expenseName');
        if (index1 > 0) {
          this.$set(this.contractTable.tableList[index1], 'prop', 'quantitiesName');
        }
        if (index2 > 0) {
          this.$set(this.mainTable.tableList[index2], 'prop', 'quantitiesName');
        }
        if (index3 > 0) {
          this.$set(this.historyMainTable.tableList[index3], 'prop', 'quantitiesName');
        }
        if (index4 > 0) {
          this.$set(this.selectMainTable.tableList[index4], 'prop', 'quantitiesName');
        }
      }
    },
    // 合同明细变红
    getTableRowClassName({row, rowIndex}) {
      const index = this.selectMainTable.tableData.findIndex(v => v.varietiesId === row.varietiesId &&
      (v.docNo === row.docNo || v.demandPlanCode === row.docNo));
      return index >= 0 ? 'selected' : '';
    },
    getRowClassName(row) {
      const index = this.selectMainTable.tableData.findIndex(v => v.varietiesId === row.varietiesId &&
      (v.docNo === row.docNo || v.demandPlanCode === row.docNo));
      return index >= 0 ? 'selected' : '';
    },
    // handleClick
    handleClick (tab, event) { },
    selectable (row, index) {
      if (row.demandPlanId) {
        return true;
      } else {
        return false;
      }
    },
    // 采购合同明细  /contract/expend/register/material/detail/list
    getVarietiesContractDateilList () {
      if (this.supplyOrderA === 'supplyOrderA') return;
      this.loading = true;
      const data = {
        contractId: this.contractId,
        projectId: this.projectId
      };
      this.$store.dispatch('supplyOrder/getContractSupplyOrder', data).then(res => {
        if (res.status === 0) {
          this.contractTable.selectedList = [];
          for (const item of res.results) {
            item.demandPlanId = item.preMainId; // 需求计划主表ID
            item.eId = item.preDetailId; // 需求计划明细id
            item.docNo = item.preDocNo; // 需求计划单号
            item.contractDetailId = item.id; // 合同明细id
            item.demandPlanTypeCode = item.demandType; // 需求类型
            item.varietiesName = item.itemName;
            item.executeVarietiesName = item.itemName;
            item.currentApplyQuantity = item.demandQuantity; // 需求数量
            item.budgetUnitPrice = item.unitPrice; // 单价
            item.requiredDate = item.buildDate; // 需用日期
            item.requiredDate = item.buildDate; // 需用日期
            item.rowKey = `${item.demandPlanTypeCode}-${item.demandPlanId}-${item.contractDetailId}-${this.selectMainTable.tableData.length + 1}`;
            const index = this.checkList.filter(v => v.contractDetailId).findIndex(v => {
              const rowKey = `${v.demandPlanTypeCode}-${v.demandPlanId}-${v.contractDetailId}-${this.selectMainTable.tableData.length + 1}`;
              return rowKey === item.rowKey;
            });
            if (index >= 0) {
              this.checkList.splice(index, 1);
              this.contractTable.selectedList.push(item);
              this.treeCheckData.push(item);
            }
          }
          this.contractTable.tableData = res.results.filter(v => v.executeVarietiesName.indexOf(this.varietiesContractName) > -1);
          this.loading = false;
        } else {
          this.loading = false;
          this.$message.error(this.$t(`exception.${res.errorCode}`));
        }
      }).catch(e => {
        this.loading = false;
      });
    },
    sysHandleContractSearch () {
      this.getVarietiesContractDateilList();
    },
    // 需求计划明细   /promaterial/demand/month/supply/order/plan
    getVarietiesDateilList () {
      this.loading = true;
      const data = {
        projectId: this.projectId,
        contractId: this.contractId,
        varietiesName: this.varietiesName
      };
      this.$store.dispatch('supplyOrder/getDemandSupplyOrder', data).then(res => {
        if (res.status === 0) {
          this.temTableData = [];
          const selectList = [];
          const selectIds = [];
          for (const item of this.selectList) {
            if (!item.contractDetailId) {
              selectIds.push(`${item.varietiesId}-${item.id}-${this.selectMainTable.tableData.length + 1}`);
            }
          }
          res.results.forEach(item => {
            item.demandPlanTypeCode === '02' && (item.applyType = `${item.applyType.substr(0, item.applyType.length - 1)}/${item.applyType.substr(item.applyType.length - 1, 1)}`);
            item.children = this.$clone(item.demandPlanSummaryDetailResultDtos);
            item.children.forEach(val => {
              val.rowKey = `${val.varietiesId}-${val.id}-${this.selectMainTable.tableData.length + 1}`;
              val.alreadyApplyQuantity = val.applyTotalQuantity + val.supplyOutboundQuantity;
              const num = Number(val.currentApplyQuantity - val.alreadyApplyQuantity).toFixed(4);
              this.$set(val, 'disabled', num <= 0);
              val.unitPrice = (val.contractUnitPrice === '' || val.contractUnitPrice === null || val.contractUnitPrice === undefined) ? val.budgetUnitPrice : val.contractUnitPrice;
            });
          });
          this.selectId = selectIds;
          this.mainTable.tableData = res.results;
          if (!this.mainTable.tableData.length) {
            this.$message.warning(this.$t('tips.varietiesMasterPlanDataNull'));
          }
          this.loading = false;
        } else {
          this.loading = false;
          this.$message.error(this.$t(`exception.${res.errorCode}`));
        }
      }).catch(e => {
        this.loading = false;
      });
    },
    // 获取历史需求计划明细 /promaterial/demand/month/already/supply/order/plan
    getHistoryVarietiesDateilList () {
      this.loading = true;
      const data = {
        projectId: this.projectId,
        contractId: this.contractId,
        varietiesName: this.varietiesName
      };
      this.$store.dispatch('supplyOrder/getHistoryDemandPurchaseApply', data).then(res => {
        if (res.status === 0) {
          this.temTableData = [];
          const selectList = [];
          const selectIds = [];
          for (const item of this.selectList) {
            if (!item.contractDetailId) {
              selectIds.push(`${item.varietiesId}-${item.id}-${this.selectMainTable.tableData.length + 1}`);
            }
          }
          res.results.forEach(item => {
            item.demandPlanTypeCode === '02' && (item.applyType = `${item.applyType.substr(0, item.applyType.length - 1)}/${item.applyType.substr(item.applyType.length - 1, 1)}`);
            item.children = this.$clone(item.demandPlanSummaryDetailResultDtos);
            item.children.forEach(val => {
              val.rowKey = `${val.varietiesId}-${val.id}-${this.selectMainTable.tableData.length + 1}`;
              val.alreadyApplyQuantity = val.applyTotalQuantity;
              val.unitPrice = (val.contractUnitPrice === '' || val.contractUnitPrice === null || val.contractUnitPrice === undefined) ? val.budgetUnitPrice : val.contractUnitPrice;
            });
          });
          this.selectHistoryId = selectIds;
          this.historyMainTable.tableData = res.results;
          this.loading = false;
        } else {
          this.loading = false;
          this.$message.error(this.$t(`exception.${res.errorCode}`));
        }
      }).catch(e => {
        this.loading = false;
      });
    },
    // 搜索
    historySysHandleSearch () {
      this.$refs.historyTree.filter(this.historyVarietiesName);
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
    // 采购合同明细--获取选中的明细
    getTableSeleList (val) {
      const data = this.$clone(val);
      data.isNew = true;
      data.rowKey = `${data.varietiesId}-${data.id}-${this.selectMainTable.tableData.length + 1}`;
      this.selectMainTable.tableData.push(data);
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
    // 需求计划 --点击行
    handleNodeCheckChange (data, node) {
      if (node && node.disabled) {
        // 已下单数量大于报量数量！
        return this.$message.error(`${this.$t('dialog.exceedTips')}`);
      }
      const arr = this.$clone(data);
      if (arr.varietiesId) {
        arr.isNew = true;
        arr.rowKey = `${arr.varietiesId}-${arr.id}-${this.selectMainTable.tableData.length + 1}`;
        this.selectMainTable.tableData.push(arr);
      } else {
        this.selectMainTable.tableData;
      }
    },
    // 历史需求计划---点击行
    historyHandleNodeCheckChange (data, node) {
      const arr = this.$clone(data);
      if (arr.varietiesId) {
        arr.isNew = true;
        arr.rowKey = `${arr.varietiesId}-${arr.id}-${this.selectMainTable.tableData.length + 1}`;
        this.selectMainTable.tableData.push(arr);
      } else {
        this.selectMainTable.tableData;
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
      flex: 7;
      max-width: 70%;
      margin-right: 20px;
      /deep/ .el-tabs {
        height: 100%;
        .el-tabs__content {
          height: calc(100% - 55px);
          .el-tab-pane {
            height: 100%;
            .cons {
              height: 100%;
              .search-cons {
                margin-bottom: 4px;
              }
              .content {
                height: calc(100% - 40px);
              }
            }
          }
        }
      }
      .content {
        position: relative;
        width: 100%;
      }
    }
    .right {
      flex: 3;
      max-width: 30%;
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
    width: calc(100% - 733px);
    padding-left: 10px;
    box-sizing: border-box;
  }
  .executeVarietiesName{
    width: calc(100% - 733px);
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
    width: 80px;
  }
  .unit {
    width: 60px;
  }
  .executeUnit{
    width: 60px;
  }
  .currentApplyQuantity {
    width: 80px;
  }
  .unitPrice{
    width: 100px;
  }
  .alreadyApplyQuantity{
    width: 80px;
  }
  .quantitiesName{
    width:100px;
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
        width: calc(100% - 733px);
        min-width: calc(100% - 733px) !important;
        max-width: calc(100% - 733px);
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
      .firstRowVarietiesName {
        float: left;
        height: 100%;
        width: 100%;
        max-width: 100%;
        display: flex;
        justify-content: space-between;
        padding-right: 20px;
        box-sizing: border-box;
        position: relative;
        .tooltip{
          width: calc(100% - 100px);
          max-width: calc(100% - 100px);
        }
      }
      .executeVarietiesName {
        float: left;
        height: 100%;
        width: calc(100% - 733px) ;
        min-width: calc(100% - 733px) !important;
        max-width: calc(100% - 733px) ;
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
        width: 80px;
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
        width: 80px;
        height: 100%;
        float: left;
      }
      .unitPrice{
        width: 100px;
        height: 100%;
        float: left;
      }
      .alreadyApplyQuantity {
        width: 80px;
        height: 100%;
        float: left;
      }
      .quantitiesName{
        width: 100px;
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
