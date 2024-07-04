<!--
 * @Author: your name
 * @Date: 2020-07-28 16:47:45
 * @LastEditTime: 2021-12-13 09:13:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\components\material\innerOuterDetials\innerOuterDetials.vue
-->
<template>
  <div class="materialVarieties">
    <div class="materialVarieties-cont">
      <div class="left" v-loading="loading" :element-loading-text="$t('tips.loadingText')">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <!-- 预算内 -->
          <el-tab-pane :label="$t('dialog.inner')" name="first">
            <div class="title">
              <div class="title-name">
                {{$t(varietiesTitle)}}
              </div>
              <el-input v-model.trim="varietiesName" prefix-icon="el-icon-search"
                :placeholder="$t('tips.varietiesNamePlanTips')" size="small" clearable
                @keyup.enter.native="sysHandleSearch('inner')" maxlength="64"></el-input>
            </div>
            <g-query-table :config="mainTable" ref="mainTable" @rowClick="getTableSeleList">
            </g-query-table>
          </el-tab-pane>
          <!-- 预算外 -->
          <el-tab-pane :label="$t('dialog.outer')" name="second">
            <div class="title">
              <div class="title-name">
                {{$t(varietyBankTitle)}}
              </div>
              <el-input v-model.trim="varietiesNameOuter" prefix-icon="el-icon-search"
                :placeholder="$t('tips.varietiesNamePlanTips')" size="small" clearable
                @keyup.enter.native="sysHandleSearch" maxlength="64"></el-input>
            </div>
            <g-query-table :config="mainOuterTable" ref="mainTable" @rowClick="getOuterTableSeleList">
            </g-query-table>
            <div class="table_pages">
              <g-to-page ref="Page" :page-size="pageSize" :total="total" @sentPages="getPages">
              </g-to-page>
            </div>
          </el-tab-pane>
          <!-- 预算外(未归类) -->
          <el-tab-pane :label="$t('dialog.outerClssify')" name="third">
            <div class="cons">
              <!-- <div class="search-cons">
                <el-input v-model.trim="varietiesNameOuterClassify" prefix-icon="el-icon-search"
                  :placeholder="$t('tips.varietiesNameTips')" size="small" clearable
                  @keyup.enter.native="mainOuterClassifySysHandleSearch" maxlength="64"></el-input>
              </div> -->
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
                        <div class="custom-tree-node" slot-scope="{ node, data }" :class="'level' + node.level">
                          <!-- <div class="tree-node" v-if="node.level === 1">
                            <div class="varietiesName">
                              <tooltips :value="`${data.demandPlanTypeValue} / ${data.applyType}`">
                              </tooltips>
                            </div>
                          </div> -->
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
  name: 'innerOuterDetials',
  mixins: [search],
  data () {
    return {
      loading: false,
      props: {
        label: 'varietiesName',
        children: 'children',
        isLeaf: 'leaf'
      },
      tableData: [
        // 预算内
        { id: -1, varietiesId: -1, demandType: '01', api: 'getInnerDetials', varietiesName: this.$t('dialog.inner'), varietiesCode: '', standards: '', unit: '', leaf: false },
        // 预算外
        { id: -2, varietiesId: -2, demandType: '02', api: 'getOuterDetials', varietiesName: this.$t('dialog.outer'), varietiesCode: '', standards: '', unit: '', leaf: false },
        { id: -3, varietiesId: -3, demandType: '03', api: 'getOuterDetials', varietiesName: this.$t('dialog.outerClssify'), varietiesCode: '', standards: '', unit: '', leaf: false }
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
          { show: true, prop: 'aliasName', label: 'fConfig.aliasName' },
          // 用途或备注
          { show: true, prop: 'varietiesRemarks', label: 'fConfig.purposeRemarks' }
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
          { show: true, prop: 'aliasName', label: 'fConfig.aliasName' },
          // 用途或备注
          { show: true, prop: 'varietiesRemarks', label: 'fConfig.purposeRemarks' }
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
          { show: true, prop: 'unit', label: 'fConfig.unit', minWidth: '60' }
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
      // =====================
      tableSeleList: [],
      selectTreeId: [],
      expandedKeys: [],
      loadingMainTable: false,
      activeName: 'first',
      checkList: [],
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
    // 选中的品种
    // selectId: {
    //   default: () => []
    // },
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
      // console.log('测试');
      this.$refs.mainOuterClassifyTree.filter(this.varietiesNameOuterClassify);
    },
    // 已勾选的明细数据处理
    async setSelectData () {
      this.loading = true;
      const selectList = this.$clone(this.selectList);
      // console.log(selectList, 'selectList');
      this.selectmainOuterClassifyId = [];
      selectList.forEach((item, index) => {
        item.sort = selectList.length - index;
        this.checkList.push(item);
        this.selectDialogList.push(item);
        this.selectMainTable.tableData.push(item);
      });
      this.mainTable.selectedList = selectList.filter(v => v.demandType === '01');
      this.mainOuterTable.selectedList = selectList.filter(v => v.demandType === '02');
      await this.getInnerData();
      await this.getOuterData();
      await this.getOuterClassifyData();
      this.loading = false;
    },
    // 获取预算内数据
    async getInnerData () {
      const data = {
        projectId: this.projectId,
        varietiesName: this.varietiesName
      };
      await this.$store.dispatch('monthPlan/getInnerDetials', data).then(res => {
        if (res.status === 0) {
          res.results.forEach(item => {
            item.demandType = '01';
            if (this.checkList.length) {
              const index = this.checkList.findIndex(v => v.varietiesId === item.varietiesId && v.demandType === '01');
              if (index >= 0) {
                this.checkList.splice(index, 1);
              }
            }
          });
          this.mainTable.tableData = res.results;
        }
      });
    },
    // 获取预算外数据
    async getOuterData () {
      const data = {
        projectId: this.projectId,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        varietiesName: this.varietiesNameOuter
      };
      await this.$store.dispatch('monthPlan/getOuterDetials', data).then(res => {
        if (res.status === 0) {
          res.results.records.forEach(item => {
            item.demandType = '02';
            if (this.checkList.length) {
              const index = this.checkList.findIndex(v => v.varietiesId === item.varietiesId && v.demandType === '02');
              if (index >= 0) {
                this.checkList.splice(index, 1);
              }
            }
          });
          this.mainOuterTable.tableData = res.results.records;
          this.total = res.results.total;
        }
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
            if (this.checkList.length) {
              const index = this.checkList.findIndex(v => v.varietiesId === item.varietiesId && v.demandType === '03');
              if (index >= 0) {
                this.checkList.splice(index, 1);
                this.$nextTick(() => {
                  this.$refs.mainOuterClassifyTree.setChecked(item.rowKey, true);
                });
              }
            }
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
            if (this.checkList.length) {
              const index = this.checkList.findIndex(v => v.varietiesId === item.varietiesId && v.demandType === '03');
              if (index >= 0) {
                this.checkList.splice(index, 1);
                this.$nextTick(() => {
                  this.$refs.mainOuterClassifyTree.setChecked(item.rowKey, true);
                });
              }
            }
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
    // 预算内勾选
    getTableSeleList (val) {
      const data = this.$clone(val);
      data.isNew = true;
      data.rowKey = `${data.varietiesId}-${this.selectMainTable.tableData.length + 1}`;
      this.selectMainTable.tableData.push(data);
    },
    // 预算外勾选
    getOuterTableSeleList (val) {
      const data = this.$clone(val);
      data.isNew = true;
      data.rowKey = `${data.varietiesId}-${this.selectMainTable.tableData.length + 1}`;
      this.selectMainTable.tableData.push(data);
    },
    // 预算外(未分类)点击行
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
        this.getOuterData();
      }
    },
    // 传出
    handleDialogStatus (status) {
      if (status === 'close') {
        this.$emit('update:close', false);
      } else {
        console.log(this.selectMainTable.tableData);
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
    min-width: 120px;
    width: calc(100% - 340px);
    padding-left: 10px;
    box-sizing: border-box;
  }
  .varietiesCode {
    width: 120px;
  }
  .standards {
    width: 140px;
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
      float: left;
      height: 40px;
      width: calc(100% - 340px);
    }
    .varietiesCode {
      width: 120px;
      height: 40px;
      float: left;
    }
    .standards {
      width: 140px;
      height: 40px;
      float: left;
    }
    .unit {
      width: 80px;
      height: 40px;
      float: left;
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
</style>
