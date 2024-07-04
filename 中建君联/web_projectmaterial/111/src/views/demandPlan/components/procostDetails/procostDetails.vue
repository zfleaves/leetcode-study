<template>
  <div class="materialVarieties">
    <div class="materialVarieties-cont">
      <div class="left">
        <el-tabs v-model="activeName">
          <el-tab-pane :label="$t(varietiesTitle)" v-loading="loading" :element-loading-text="$t('tips.loadingText')" name="second">
            <div class="title">
              <el-input v-model.trim="queryParam" prefix-icon="el-icon-search"
                :placeholder="$t('tips.varietiesNameTips')" size="small" clearable @keyup.enter.native="sysHandleSearch"
                maxlength="64"></el-input>
            </div>
            <div class="cons-table-t content" :style="{height: `${dialogHeight - 240}px`}">
              <div class="fixed-scroll" style="display: flex;flex-direction: column;">
                <div class="treeTitle">
                  <div v-for="item in mainTable.tableList" :key="item.prop" :class="item.prop">
                    {{$t(item.label)}}
                  </div>
                </div>
                <div class="treeCons" v-if="!loading">
                  <div class="fixed-scroll">
                    <el-tree :data="mainTable.tableData" ref="tree" node-key="rowKey" :props='props'
                      show-checkbox class="tree-content" :default-checked-keys="selectId"
                      @node-click="handleNodeCheckChange" @check-change="handleCheckChange"
                      @check="handleCheck">
                      <template slot="empty">
                        <no-data>
                        </no-data>
                      </template>
                      <div class="custom-tree-node" slot-scope="{ node, data }">
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
                <g-to-page ref="Page" :page-size="pageSize" :total="total" @sentPages="getPages">
                </g-to-page>
            </div>
          </el-tab-pane>
          <!-- 施工签证 -->
          <!-- <el-tab-pane v-if="costControlRuleCode === '01'" :label="$t(signVarietiesTitle)" name="first">
            <div class="title" v-if="!loadingSign">
              <el-input v-model.trim="signQueryParam" prefix-icon="el-icon-search"
                :placeholder="$t('tips.varietiesNameTips')" size="small" clearable
                @keyup.enter.native="signSysHandleSearch" maxlength="64"></el-input>
            </div>
            <div class="cons-table-t content" :style="{height: `${dialogHeight - 240}px`}"  v-loading="loadingSign" :element-loading-text="$t('tips.loadingText')">
              <div class="fixed-scroll" style="display: flex;flex-direction: column;">
                <div class="treeTitle">
                  <div v-for="item in signMainTable.tableList" :key="item.prop" :class="item.prop">
                    {{$t(item.label)}}
                  </div>
                </div>
                <div class="treeCons" v-if="!loadingSign">
                  <div class="fixed-scroll">
                    <el-tree :data="signMainTable.tableData" ref="signTree" node-key="rowKey" :props='props'
                      show-checkbox class="tree-content" :default-checked-keys="selectSignId"
                      @node-click="handleNodeCheckChangeSign" @check-change="handleCheckChangeSign"
                      @check="handleCheck">
                      <template slot="empty">
                        <no-data>
                        </no-data>
                      </template>
                      <div class="custom-tree-node" slot-scope="{ node, data }">
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
                <g-to-page ref="PageSign" :page-size="pageSizeSign" :total="totalSign" @sentPages="getPagesSign">
                </g-to-page>
            </div>
          </el-tab-pane> -->
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
  name: 'signDetails',
  mixins: [search],
  data () {
    return {
      loading: false,
      loadingSign: false,
      activeName: 'second',
      props: {
        label: 'varietiesName',
        children: 'children',
        isLeaf: 'leaf'
      },
      mainTable: {
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
      signMainTable: {
        rowKey: 'rowKey',
        // 表格数据
        tableData: [],
        // 表格高度
        maxHeight: 500,
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
      total: 0,
      pageNo: 1,
      pageSize: 20,
      queryParam: '',
      totalSign: 0,
      pageNoSign: 1,
      pageSizeSign: 20,
      signQueryParam: '',
      // =====================
      tableSeleList: [],
      varietiesDateilUrl: '',
      signVarietiesDateilUrl: '',
      selectId: [],
      selectSignId: [],
      guids: '',
      checkList: [],
      innerTableSeleList: [],
      outerTableSeleList: []
    };
  },
  props: {
    dialogHeight: {
      type: Number,
      default: 300
    },
    // 目标成本分解中的材料明细
    varietiesTitle: {
      type: String,
      default: 'masterPlan.varietiesDetails'
    },
    // 施工签证中的材料明细
    signVarietiesTitle: {
      type: String,
      default: 'masterPlan.signVarietiesDetails'
    },
    // 只有精细成本管理时显示施工签证table页，
    costControlRuleCode: {
      type: String,
      default: '01'
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
    this.signMainTable.maxHeight = this.dialogHeight - 260;
    this.mainTable.maxHeight = this.dialogHeight - 260;
    const selectList = this.$clone(this.selectList);
    selectList.forEach((item, index) => {
      item.sort = selectList.length - index;
      const rowKey = `${item.sourceType}-${item.preDetailId}`;
      this.$set(item, 'rowKey', rowKey);
      if (item.sourceType === '02') {
        this.innerTableSeleList.push(item);
      }
      if (item.sourceType === '03') {
        this.outerTableSeleList.push(item);
      }
      this.selectId.push(rowKey); // 默认勾选
      this.selectSignId.push(rowKey); // 默认勾选
      this.checkList.push(item);
      this.selectMainTable.tableData.push(item);
    });
    this.getVarietiesDateilList();
    this.getProcostSignMasterDetail();
  },
  methods: {
    // 分页
    getPages (obj) {
      if (obj.isSzieChange) {
        this.pageSize = obj.pageSize;
      } else {
        this.pageNo = obj.pageNo;
      }
      const selectList = this.$clone(this.selectMainTable.tableData);
      selectList.forEach((item, index) => {
        item.sort = selectList.length - index;
        const rowKey = `${item.sourceType}-${item.preDetailId}`;
        this.$set(item, 'rowKey', rowKey);
        if (item.sourceType === '02') {
          this.innerTableSeleList.push(item);
        }
        if (item.sourceType === '03') {
          this.outerTableSeleList.push(item);
        }
        this.selectId.push(rowKey); // 默认勾选
        this.selectSignId.push(rowKey); // 默认勾选
        this.checkList.push(item);
      });
      this.getVarietiesDateilList();
    },
    // 目标成本
    getVarietiesDateilList () {
      this.loading = true;
      const data = {
        costTypeCodes: ['02'],
        docNo: '',
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        queryParam: this.queryParam,
        projectId: this.projectId
      };
      this.$store.dispatch('masterPlan/getProcostMasterDetail', data).then(res => {
        if (res.status === 0) {
          const results = res.results.records || [];
          //  sourceType 02为目标成本,03签证
          for (const item of results) {
            this.$set(item, 'sourceType', '02');
            this.$set(item, 'rowKey', `02-${item.id}`);
            item.children = this.$clone(item.details);
            for (const children of item.children) {
                this.$set(children, 'sourceType', '02');
                this.$set(children, 'varietiesName', children.materialName);
                this.$set(children, 'standards', children.features);
                this.$set(children, 'preDetailId', children.id);
                this.$set(children, 'preMainId', item.id);
                this.$set(children, 'preDocNo', item.docNo);
                this.$set(children, 'controlQuantity', children.quantity);
                this.$set(children, 'controlUnitPrice', children.unitPrice);
                this.$set(children, 'controlTotalAmount', children.totalPrice);
                this.$set(children, 'bidTotalAmount', children.bidTotalPrice);
                this.$set(children, 'projectDetailCode', item.projectDetailCode);
                this.$set(children, 'projectDetailName', item.projectDetailName);
                this.$set(children, 'rowKey', `02-${children.id}`);
                if (this.checkList.length) {
                    const index = this.checkList.findIndex(v => v.rowKey === children.rowKey);
                    if (index >= 0) {
                        this.checkList.splice(index, 1);
                    }
                }
            }
          }
          this.selectId = this.selectMainTable.tableData.map(v => v.rowKey);
          this.mainTable.tableData = results;
          this.total = res.results.total;
        } else {
          this.$message.error(this.$t(`exception.${res.errorCode}`));
        }
        this.loading = false;
      }).catch(e => {
        console.log(e, 'e');
        this.loading = false;
      });
    },
    // 分页
    getPagesSign (obj) {
      if (obj.isSzieChange) {
        this.pageSizeSign = obj.pageSize;
      } else {
        this.pageNoSign = obj.pageNo;
      }
      const selectList = this.$clone(this.selectMainTable.tableData);
      selectList.forEach((item, index) => {
        item.sort = selectList.length - index;
        const rowKey = `${item.sourceType}-${item.preDetailId}`;
        this.$set(item, 'rowKey', rowKey);
        if (item.sourceType === '02') {
          this.innerTableSeleList.push(item);
        }
        if (item.sourceType === '03') {
          this.outerTableSeleList.push(item);
        }
        this.selectId.push(rowKey); // 默认勾选
        this.selectSignId.push(rowKey); // 默认勾选
        this.checkList.push(item);
      });
      this.getProcostSignMasterDetail();
    },
    // 获取施工签证
    getProcostSignMasterDetail () {
      this.loadingSign = true;
      const data = {
        costTypeCodes: ['02'],
        docNo: '',
        pageNo: this.pageNoSign,
        pageSize: this.pageSizeSign,
        projectId: this.projectId,
        queryParam: this.signQueryParam
      };
      this.$store.dispatch('masterPlan/getProcostSignMasterDetail', data).then(res => {
        if (res.status === 0) {
          const results = res.results.records || [];
          //  sourceType 02为目标成本,03签证
          for (const item of results) {
            this.$set(item, 'sourceType', '03');
            this.$set(item, 'rowKey', `03-${item.id}`);
            item.children = this.$clone(item.details);
            for (const children of item.children) {
                this.$set(children, 'sourceType', '03');
                this.$set(children, 'varietiesName', children.materialName);
                this.$set(children, 'standards', children.features);
                this.$set(children, 'preDetailId', children.id);
                this.$set(children, 'preMainId', item.id);
                this.$set(children, 'preDocNo', item.docNo);
                this.$set(children, 'controlQuantity', children.quantity);
                this.$set(children, 'controlUnitPrice', children.unitPrice);
                this.$set(children, 'controlTotalAmount', children.totalPrice);
                this.$set(children, 'bidTotalAmount', children.bidTotalPrice);
                this.$set(children, 'projectDetailCode', item.projectDetailCode);
                this.$set(children, 'projectDetailName', item.projectDetailName);
                this.$set(children, 'rowKey', `03-${children.id}`);
                if (this.checkList.length) {
                    const index = this.checkList.findIndex(v => v.rowKey === children.rowKey);
                    if (index >= 0) {
                        this.checkList.splice(index, 1);
                    }
                }
            }
          }
          this.selectId = this.selectMainTable.tableData.map(v => v.rowKey);
          this.signMainTable.tableData = results;
          this.totalSign = res.results.total;
        } else {
          this.$message.error(this.$t(`exception.${res.errorCode}`));
        }
        this.loadingSign = false;
      }).catch(e => {
        this.loadingSign = false;
      });
    },
    // 搜索
    sysHandleSearch () {
      this.pageNo = 1;
      this.getVarietiesDateilList();
    },
    // 搜索
    signSysHandleSearch () {
      this.pageNoSign = 1;
      this.getProcostSignMasterDetail();
    },
    handleCheck(row) {
      if (!row.checked) {
        const index = this.selectMainTable.tableData.findIndex(v => v.rowKey === row.rowKey);
        if (index >= 0) {
            this.selectMainTable.tableData.splice(index, 1);
        }
      }
    },
    handleCheckChange (row, status) {
      this.$set(row, 'checked', status);
      const selectVarietiesList = this.$refs.tree.getCheckedNodes().filter(v => v.preDetailId > 0);
      this.innerTableSeleList = selectVarietiesList;
      this.concatSelectData();
    },
    // 点击行
    handleNodeCheckChange (data, node) {
      if (data.preDetailId > 0) {
        if (node.checked) {
          const index = this.selectMainTable.tableData.findIndex(v => v.rowKey === data.rowKey);
          if (index >= 0) {
              this.selectMainTable.tableData.splice(index, 1);
          }
        }
        this.$set(data, 'sort', this.selectMainTable.tableData.length + 1);
        this.$set(data, 'checked', !node.checked);
        this.$refs.tree.setChecked(data.rowKey, !node.checked);
      }
    },
    handleCheckChangeSign (row, status) {
      this.$set(row, 'checked', status);
      const selectVarietiesList = this.$refs.signTree.getCheckedNodes().filter(v => v.preDetailId > 0);
      this.outerTableSeleList = selectVarietiesList;
      this.concatSelectData();
    },
    // 点击行
    handleNodeCheckChangeSign (data, node) {
      if (data.preDetailId > 0) {
        if (node.checked) {
          const index = this.selectMainTable.tableData.findIndex(v => v.rowKey === data.rowKey);
          if (index >= 0) {
              this.selectMainTable.tableData.splice(index, 1);
          }
        }
        this.$set(data, 'sort', this.selectMainTable.tableData.length + 1);
        this.$set(data, 'checked', !node.checked);
        this.$refs.signTree.setChecked(data.rowKey, !node.checked);
      }
    },
    // 合并勾选的数组
    concatSelectData() {
      const data = this.$clone(this.checkList);
      const tableData = this.innerTableSeleList.concat(this.outerTableSeleList, data);
      const otherSelectTableData = [];
      for (const item of this.selectMainTable.tableData) {
        const index = tableData.findIndex(v => v.rowKey === item.rowKey);
        if (index < 0) {
          otherSelectTableData.push(item);
        }
      }
      const selectTableData = tableData.concat(otherSelectTableData);
      const selectMainTable = this.unique(selectTableData.sort(this.compare));
      this.selectMainTable.tableData = selectMainTable;
    },
    // 排序 比较大小
    compare (obj1, obj2) {
      const val1 = obj1.sort;
      const val2 = obj2.sort;
      if (val1 < val2) {
        return -1;
      } else if (val1 > val2) {
        return 1;
      } else {
        return 0;
      }
    },
    unique (arr) {
      const list = []; // 选中
      arr.forEach(item => {
        const index = list.findIndex(v => v.rowKey === item.rowKey);
        if (index < 0) {
          list.push(item);
        }
      });
      return list;
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
.table_pages{
  margin-top: 10px;
  text-align: center;
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
.imgUrlList {
  display: inline-block;
  vertical-align: top;
  overflow: hidden;
}
</style>
