
<template>
  <div class="materialVarieties">
    <div class="materialVarieties-cont">
      <div class="left" :element-loading-text="$t('tips.loadingText')">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <!-- 已策划 -->
          <el-tab-pane :label="$t('dialog.planned')" name="first">
            <div class="title">
                <div class="title-name">
                    {{$t(varietiesTitle)}}
                </div>
                <el-input v-model.trim="queryParam" prefix-icon="el-icon-search" :placeholder="$t('tips.varietiesNameTips')"
                    size="small" clearable @keyup.enter.native="sysHandleSearch('inner')" maxlength="64"></el-input>
            </div>
            <div class="cons-table-t content" :style="{height: `${dialogHeight - 180}px`}" v-loading="loading">
                <div class="fixed-scroll" style="display: flex;flex-direction: column;">
                    <div class="treeTitle">
                    <div v-for="item in mainTable.tableList" :key="item.prop" :class="item.prop">
                        {{$t(item.label)}}
                    </div>
                    </div>
                    <div class="treeCons">
                    <div class="fixed-scroll">
                        <el-tree
                          :data="mainTable.tableData"
                          ref="tree"
                          node-key="rowKey"
                          :props='props'
                          class='tree-content'
                        @node-click="handleNodeCheckChange">
                        <template slot="empty">
                            <no-data>
                            </no-data>
                        </template>
                        <div class="custom-tree-node" slot-scope="{node, data}"
                            :class="'level' + node.level"
                            :style='{color: getRowClassName(data)}'>
                            <div class="tree-node" v-if="node.level === 1">
                              <div class="varietiesName selectAll" style="width: 100%; max-width: 100%">
                                  <tooltips
                                  :value="`${$t('tips.theFirst')}${data.schemeNum || 1}${$t('dialog.schemeNumTips')}-${data.docNo}${data.schemeContent ? `-${data.schemeContent}` : ''}`"
                                  >
                                  </tooltips>
                                  <span class="midFont set" @click="handleSelectAll(data, 'handleNodeCheckChange')">{{$t('fConfig.selectAll')}}</span>
                              </div>
                            </div>
                            <div class="tree-node" v-else-if="node.level === 2">
                                <div class="varietiesName">
                                   <el-checkbox
                                      v-if='data.disabled'
                                      disabled
                                      class="el-checkbox-varietiesName"
                                    >
                                  </el-checkbox>
                                  <tooltips :value="`${data.varietiesName}${(data.quantitiesName || data.expenseName) ? ` - ${(data.quantitiesName || data.expenseName)}` : ''}`"
                                  :title="`${data.varietiesName}${(data.quantitiesName || data.expenseName) ? ` - ${(data.quantitiesName || data.expenseName)}` : ''}`"
                                  style='display: inline-block; margin-left: 25px;'>
                                  </tooltips>
                                </div>
                                <div class="varietiesCode">
                                  <tooltips :value="data.varietiesCode">
                                  </tooltips>
                                </div>
                                <div class="standards">
                                  <tooltips :value="data.standards" :title="data.standards">
                                  </tooltips>
                                </div>
                                <div class="unit">
                                  <tooltips :value="data.unit">
                                  </tooltips>
                                </div>
                                <div class="aliasName">
                                  <tooltips :value="data.aliasName">
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
          <!-- 未策划 -->
          <el-tab-pane :label="$t('dialog.notPlanned')" name="second">
            <div v-loading="loadingOuter">
              <div class="title">
                <div class="title-name">
                  {{$t('dialog.varietyBank')}}
                </div>
                <el-input v-model.trim="varietiesNameOuter" prefix-icon="el-icon-search"
                  :placeholder="`${$t('tips.pleaseEnter')}${$t('fConfig.varietiesNameSc')}`" size="small" clearable
                  @keyup.enter.native="sysHandleSearch" maxlength="64"></el-input>
                <el-input v-model.trim="standards" prefix-icon="el-icon-search"
                  :placeholder="`${$t('tips.pleaseEnter')}${$t('fConfig.standards')}`" size="small" clearable
                  @keyup.enter.native="sysHandleSearch" maxlength="64" style="margin-left: 20px;"></el-input>
              </div>
              <g-query-table :config="mainOuterTable" ref="mainTable" @rowClick="getOuterTableSeleList"
              :getRowClassName="getTableRowClassName"
              >
              </g-query-table>
              <div class="table_pages">
                <g-to-page ref="Page" :page-size="pageSize" :total="total" @sentPages="getPages">
                </g-to-page>
              </div>
            </div>
          </el-tab-pane>
          <!-- 未策划(未归类) -->
          <el-tab-pane :label="$t('dialog.notPlannedClssify')" name="third">
            <div class="cons">
              <div class="cons-table-t content" :style="{height: `${dialogHeight - 130}px`}" v-loading="treeLoading">
                <div class="fixed-scroll" style="display: flex;flex-direction: column;">
                  <div class="treeTitle">
                    <div v-for="item in mainOuterClassifyTable.tableList" :key="item.prop" :class="item.prop">
                      {{$t(item.label)}}
                    </div>
                  </div>
                  <div class="treeCons">
                    <div class="fixed-scroll">
                      <el-tree :data="mainOuterClassifyTable.tableData" ref="mainOuterClassifyTree" node-key="rowKey"
                        :props='props' class="tree-content" :filter-node-method="filterNode"
                        :default-checked-keys="selectmainOuterClassifyId" :load="loadNode" lazy
                        @node-click="mainOuterClassifyHandleNodeCheckChange">
                        <template slot="empty">
                          <no-data>
                          </no-data>
                        </template>
                        <div class="custom-tree-node" slot-scope="{ node, data }" :class="'level' + node.level"
                        :style='{color: getRowClassName(data)}'>
                          <div class="tree-node">
                            <div class="varietiesName">
                              <tooltips :value="data.varietiesName" :title="data.varietiesName">
                              </tooltips>
                            </div>
                            <div class="varietiesCode">
                              <tooltips :value="data.varietiesCode">
                              </tooltips>
                            </div>
                            <div class="standards">
                              <tooltips :value="data.standards" :title="data.standards">
                              </tooltips>
                            </div>
                            <div class="unit">
                              <tooltips :value="data.unit">
                              </tooltips>
                            </div>
                            <div class="aliasName">
                              <tooltips :value="data.aliasName">
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
        <g-query-table :config="selectMainTable" @fnName="pageConfigEmitQueryTableButtonFnName"
         >
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
  name: 'innerOuterPlanDetials',
  mixins: [search],
  data () {
    return {
      loading: false,
      loadingOuter: false,
      props: {
        label: 'varietiesName',
        children: 'children',
        isLeaf: 'leaf'
      },
      tableData: [
        // 已策划
        { id: -1, varietiesId: -1, demandType: '01', api: 'getInnerDetials', varietiesName: this.$t('dialog.planned'), varietiesCode: '', standards: '', unit: '', leaf: false },
        // 未策划
        { id: -2, varietiesId: -2, demandType: '02', api: 'getOuterDetials', varietiesName: this.$t('dialog.notPlanned'), varietiesCode: '', standards: '', unit: '', leaf: false },
        { id: -3, varietiesId: -3, demandType: '03', api: 'getOuterDetials', varietiesName: this.$t('dialog.notPlannedClssify'), varietiesCode: '', standards: '', unit: '', leaf: false }
      ],
      mainTable: {
        rowKey: 'rowKey',
        selectedList: [],
        isCheckbox: false,
        // 表格数据
        tableData: [],
        // 子系统表头渲染参数
        tableList: [
          // 材料品种名称
          { show: true, prop: 'varietiesName', label: 'fConfig.varietiesName', minWidth: 140 },
          // 材料品种编码
          { show: true, prop: 'varietiesCode', label: 'fConfig.varietiesCode', minWidth: 140 },
          // 规格
          { show: true, prop: 'standards', label: 'fConfig.standards' },
          // 单位
          { show: true, prop: 'unit', label: 'fConfig.unit' },
          // 别名
          { show: true, prop: 'aliasName', label: 'fConfig.aliasName' }
        ]
      },
      mainOuterTable: {
        rowKey: 'rowKey',
        selectedList: [],
        isCheckbox: false,
        // 表格数据
        tableData: [],
        // 子系统表头渲染参数
        tableList: [
          // 材料品种名称
          { show: true, prop: 'varietiesName', label: 'fConfig.varietiesName', minWidth: 140 },
          // 材料品种编码
          { show: true, prop: 'varietiesCode', label: 'fConfig.varietiesCode', minWidth: 140 },
          // 规格
          { show: true, prop: 'standards', label: 'fConfig.standards' },
          // 单位
          { show: true, prop: 'unit', label: 'fConfig.unit' },
          // 别名
          { show: true, prop: 'aliasName', label: 'fConfig.aliasName' }
        ]
      },
      mainOuterClassifyTable: {
        rowKey: 'rowKey',
        // 表格数据
        tableData: [],
        // 表格高度
        maxHeight: 500,
        // 子系统表头渲染参数
        tableList: [
          // 材料品种名称
          { show: true, prop: 'varietiesName', label: 'fConfig.varietiesName' },
          // 材料品种编码
          { show: true, prop: 'varietiesCode', label: 'fConfig.varietiesCode', minWidth: '120' },
          // 规格
          { show: true, prop: 'standards', label: 'fConfig.standards', minWidth: '100' },
          // 单位
          { show: true, prop: 'unit', label: 'fConfig.unit', minWidth: '60' },
          // 别名
          { show: true, prop: 'aliasName', label: 'fConfig.aliasName' }
          // 用途或备注
          // { show: true, prop: 'varietiesRemarks', label: 'fConfig.purposeRemarks' }
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
          { show: true, prop: 'varietiesName', label: 'fConfig.varietiesName' },
          // 规格
          { show: true, prop: 'standards', label: 'fConfig.standards', minWidth: '140' },
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
      varietiesNameOuter: '',
      standards: '',
      // =====================
      queryParam: '',
      tableSeleList: [],
      selectTreeId: [],
      expandedKeys: [],
      loadingMainTable: false,
      activeName: 'first',
      selectDialogList: [],
      pageNo: 1,
      pageSize: 100,
      total: 0,
      innerTableSeleList: [],
      outerTableSeleList: [],
      classifyTableSeleList: [],
      varietiesNameOuterClassify: '',
      selectmainOuterClassifyId: ['27833/01010001'],
      classifyTreeData: [],
      treeLoading: false
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
    varietyBankTitle: {
      type: String,
      default: 'dialog.varietyBank'
    },
    selectList: {
      default: () => []
    },
    projectId: {
      default: 0
    }
  },
  async created () {
    this.selectMainTable.maxHeight = this.dialogHeight - 130;
    this.mainTable.maxHeight = this.dialogHeight - 190;
    this.mainOuterTable.maxHeight = this.dialogHeight - 230;
    this.setSelectData();
  },
  methods: {
    // 删除
    handleDelete(row) {
      this.$confirm(`${this.$t('button.delete')} ${row.varietiesName}?`, this.$t('button.delete'), {
        confirmButtonText: this.$t('button.determine'),
        cancelButtonText: this.$t('button.close'),
        type: 'warning'
      }).then(() => {
          this.selectMainTable.tableData.splice(this.selectMainTable.tableData.indexOf(row), 1);
      }).catch(() => { });
      console.log(row, 'row');
    },
    // 搜索
    mainOuterClassifySysHandleSearch () {
      this.$refs.mainOuterClassifyTree.filter(this.varietiesNameOuterClassify);
    },
    // 已勾选的明细数据处理
    async setSelectData () {
      const selectList = this.$clone(this.selectList);
      this.selectmainOuterClassifyId = [];
      selectList.forEach((item, index) => {
        item.sort = selectList.length - index;
        item.rowKey = `${item.varietiesId}-${index + 1}`;
        this.selectDialogList.push(item);
        this.selectMainTable.tableData.push(item);
      });
      this.mainTable.selectedList = selectList.filter(v => v.demandType === '01');
      this.mainOuterTable.selectedList = selectList.filter(v => v.demandType === '02');
      await this.getInnerData();
      await this.getOuterData();
      await this.getOuterClassifyData();
    },
    // 获取预算内数据
    async getInnerData () {
      this.loading = true;
      const data = {
        projectId: this.projectId,
        docNo: '',
        queryParam: this.queryParam
      };
      this.$store.dispatch('monthPlan/getDemandInnerList', data).then(res => {
        if (res.status === 0) {
          const results = res.results;
          for (const item of results) {
            this.$set(item, 'demandType', '01');
            this.$set(item, 'rowKey', `01-${item.id}`);
            item.children = this.$clone(item.masterPlanDetails);
            for (const children of item.children) {
                // 前端 直接用策划数量减去已申请数量 是否大于0去判断，
                const num = Number(children.changeAfterQuantity - children.applyQuantity).toFixed(4);
                this.$set(children, 'disabled', num <= 0);
                // console.log(num, 'num');
                this.$set(children, 'demandType', '01');
                this.$set(children, 'masterPlanId', item.id);
                this.$set(children, 'masterPlanDocNo', item.docNo);
                this.$set(children, 'eId', children.id);
                this.$set(children, 'budgetTotalAmount', children.changeAfterAmount);
                this.$set(children, 'budgetUnitPrice', children.changeAfterUnitPrice);
                this.$set(children, 'budgetQuantity', children.changeAfterQuantity);
                this.$set(children, 'rowKey', `01-${children.id}`);
            }
          }
          this.mainTable.tableData = results;
        } else {
          this.$message.error(this.$t(`exception.${res.errorCode}`));
        }
        this.loading = false;
      }).catch(e => {
        this.loading = false;
      });
    },
    // 获取预算外数据
    async getOuterData () {
      this.loadingOuter = true;
      const data = {
        projectId: this.projectId,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        varietiesName: this.varietiesNameOuter,
        standards: this.standards
      };
      await this.$store.dispatch('monthPlan/getOuterDetials', data).then(res => {
        if (res.status === 0) {
          res.results.records.forEach(item => {
            item.demandType = '02';
          });
          this.mainOuterTable.tableData = res.results.records;
          this.total = res.results.total;
        }
        this.loadingOuter = false;
      }).catch(e => {
        this.loadingOuter = false;
      });
    },
    // 条件过滤
    filterNode (value, data) {
      if (!value) return true;
      const code = `${data.varietiesCode}${data.varietiesName}${data.standards}${data.unit}`;
      return code.indexOf(value) !== -1;
    },
    // 懒加载
    async loadNode (node, resolve) {
      // console.log(node.level, 'level');
      if (node.level === 0) {
        return resolve(this.mainOuterClassifyTable.tableData);
      } else if (node.level === 1) {
        return resolve(node.data.children);
      } else if (node.level === 2) {
        const data = {
          projectId: this.projectId,
          classifyId: node.data.id,
          varietiesName: ''
        };
        const res = await this.$store.dispatch('monthPlan/getOuterClassifyDetials', data);
        let list = [];
        if (res.status === 0) {
          list = res.results || [];
          for (const item of list) {
            item.leaf = true;
            item.varietiesId = item.id;
            item.rowKey = `${item.id}/${item.varietiesCode}`;
          }
        }
        return resolve(node.data.children.concat(list));
      } else {
        const data = {
          projectId: this.projectId,
          classifyId: node.data.id,
          varietiesName: ''
        };
        const res = await this.$store.dispatch('monthPlan/getOuterClassifyDetials', data);
        let list = [];
        if (res.status === 0) {
          list = res.results || [];
          for (const item of list) {
            item.leaf = true;
            item.varietiesId = item.id;
            item.rowKey = `${item.id}/${item.varietiesCode}`;
          }
        }
        return resolve(node.data.children.concat(list));
      }
    },
    // 获取预算外数据
    async getOuterClassifyData () {
      this.treeLoading = true;
      const treeData = {
        classifyCode: '',
        classifyDiscription: '',
        classifyName: '',
        createByName: '',
        pageNo: 1,
        pageSize: 10,
        updateByName: ''
      };
      this.$store.dispatch('classifyWarehouse/getClassifyTree', treeData).then(res => {
        this.setTreeData(res.results);
        this.mainOuterClassifyTable.tableData = res.results;
        this.treeLoading = false;
      }).catch(e => {
        this.treeLoading = false;
      });
    },
    setTreeData (arr) {
      for (const item of arr) {
        item.rowKey = `${item.id}/${item.classifyCode}`;
        item.varietiesName = item.classifyName;
        item.varietiesCode = item.classifyCode;
        if (item.children && item.children.length) {
          this.setTreeData(item.children);
          item.isClassify = true;
        } else {
          item.isClassify = false;
        }
      }
    },
    // 分页
    getPages (obj) {
      if (obj.isSzieChange) {
        this.pageSize = obj.pageSize;
      } else {
        this.pageNo = obj.pageNo;
      }
      this.getOuterData();
    },
    // tab页切换
    handleClick (tab, event) {
      // console.log(tab, event);
    },
    // 全选
    handleSelectAll(data, funType) {
      if (data.children && data.children.length) {
        const disabledList = data.children.filter(v => v.disabled);
        const list = data.children.filter(v => !v.disabled);
        for (const item of list) {
          const arr = this.$clone(item);
          if (arr.eId) {
            arr.isNew = true;
            arr.rowKey = `${arr.eId}-${this.selectMainTable.tableData.length + 1}`;
            this.selectMainTable.tableData.push(arr);
          } else {
            this.selectMainTable.tableData;
          }
        }
        if (disabledList && disabledList.length) {
          // XX策划数量已申请完，请重新填报策划后再选择！
          this.$message.error(`${disabledList.map(v => v.varietiesName).join(',')} ${this.$t('dialog.applicationCompletedTips')}`);
        }
      }
    },
    // 预算内勾选
    getTableSeleList (val) {
      const data = this.$clone(val);
      data.isNew = true;
      data.rowKey = `${data.varietiesId}-${this.selectMainTable.tableData.length + 1}`;
      this.selectMainTable.tableData.push(data);
    },
    // 点击行
    handleNodeCheckChange (data) {
      if (data.disabled) {
        // XX策划数量已申请完，请重新填报策划后再选择！
        return this.$message.error(`${data.varietiesName} ${this.$t('dialog.applicationCompletedTips')}`);
      }
      const arr = this.$clone(data);
      if (arr.eId) {
        arr.isNew = true;
        arr.rowKey = `${arr.eId}-${this.selectMainTable.tableData.length + 1}`;
        this.selectMainTable.tableData.push(arr);
      } else {
        this.selectMainTable.tableData;
      }
    },
    // 预算外勾选
    getOuterTableSeleList (val) {
      const data = this.$clone(val);
      data.isNew = true;
      data.rowKey = `${data.varietiesId}-${this.selectMainTable.tableData.length + 1}`;
      this.selectMainTable.tableData.push(data);
    },
    // 未策划(未分类)点击行
    mainOuterClassifyHandleNodeCheckChange (data, node) {
      const arr = this.$clone(data);
      if (arr.varietiesId) {
        arr.isNew = true;
        arr.rowKey = `${arr.varietiesId}-${this.selectMainTable.tableData.length + 1}`;
        this.selectMainTable.tableData.push(arr);
      } else {
        this.selectMainTable.tableData;
      }
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
    // 搜索
    sysHandleSearch (type) {
      if (type === 'inner') {
        this.getInnerData();
      } else {
        this.$refs.Page && this.$refs.Page.setCurrentPage();
        // this.getOuterData();
      }
    },
    // 传出
    handleDialogStatus (status) {
      if (status === 'close') {
        this.$emit('update:close', false);
      } else {
        // console.log(this.selectMainTable.tableData);
        this.$emit('getData', this.selectMainTable.tableData);
      }
    },
    // 未策划
    getTableRowClassName({row, rowIndex}) {
      const index = this.selectMainTable.tableData.findIndex(v => v.varietiesId === row.varietiesId);
      return index >= 0 ? 'selected' : '';
    },
    getRowClassName(row) {
      // console.log(row.demandType, 'demandType');
      if (row.demandType === '01') {
        const index = this.selectMainTable.tableData.findIndex(v => v.eId === row.id);
        return index >= 0 ? 'red' : '';
      }
      if (row.demandType === '03') {
         const index = this.selectMainTable.tableData.findIndex(v => v.varietiesId === row.varietiesId);
         return index >= 0 ? 'red' : '';
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
      max-width: 60%;
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
      .content {
        position: relative;
        width: 100%;
      }
    }
    .right {
      flex: 4;
      max-width: 40%;
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
    min-width: 120px;
    width: calc(100% - 380px);
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
  .aliasName{
    width: 100px;
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
    // display: flex;
    flex-direction: row;
    height: 100%;
    flex: 1;
    text-align: left;
    /deep/ .tree-node {
      height: 40px;
    }
    .varietiesName {
      min-width: 100px;
      display: inline-block;
      height: 40px;
      width: calc(100% - 380px);
      min-width: calc(100% - 380px) !important;
      max-width: calc(100% - 380px) ;
      position: relative;
      .el-checkbox-varietiesName{
        display: inline-block;
        width: 8px;
        position: absolute;
      }
    }
    .selectAll{
      display: flex;
      justify-content: space-between;
      padding-right: 20px;
      box-sizing: border-box;
    }
    .varietiesCode {
      width: 100px;
      height: 40px;
      display: inline-block;
    }
    .standards {
      width: 100px;
      height: 40px;
      display: inline-block;
    }
    .unit {
      width: 80px;
      height: 40px;
      display: inline-block;
    }
    .aliasName{
      width: 100px;
      height: 40px;
      display: inline-block;
    }
  }
}
.imgUrlList {
  display: inline-block;
  vertical-align: top;
  overflow: hidden;
}
.table_pages {
  margin-top: 10px;
  text-align: center;
}
/deep/ .tooltip {
  max-width: 600px;
  word-wrap: break-word; /*强制换行*/
  overflow: hidden; /*超出隐藏*/
  text-overflow: ellipsis;/*隐藏后添加省略号*/
  white-space: nowrap;/*强制不换行*/
}

</style>
