<!--
 * @Author: your name
 * @Date: 2020-07-28 16:47:45
 * @LastEditTime: 2023-04-28 11:56:51
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\components\material\innerOuterDetials\innerOuterDetials.vue
-->
<template>
  <div class="materialVarieties">
    <div class="materialVarieties-cont">
      <div class="left" v-loading="loading" :element-loading-text="$t('tips.loadingText')">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <!-- 到货验收/临时租赁 -->
          <el-tab-pane :label="$t('warIncoming.checkarrivalSporadicDetail')" name="first">
            <div class="title">
              <div class="title-name">
                {{$t(varietiesTitle)}}
              </div>
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
                    <el-tree :data="mainTable.tableData.filter(v => v.sourceType === sourceType)" ref="tree" node-key="rowKey" :props='props'
                      class="tree-content" :default-expanded-keys="[1]" :filter-node-method="filterNode"
                      :default-checked-keys="selectId" :load="loadNode" lazy @node-click="handleNodeCheckChange">
                      <template slot="empty">
                        <no-data>
                        </no-data>
                      </template>
                      <div class="custom-tree-node" slot-scope="{node, data}" :class="'level' + data.level">
                        <div class="tree-node" v-if="node.level === 1">
                          <div class="executeVarietiesName">
                            <tooltips :value="data.executeVarietiesName">
                            </tooltips>
                          </div>
                        </div>
                        <div class="tree-node" v-else-if="node.level === 2">
                          <div class="selectAll">
                            <div class="selectAll-name ellipsis">
                              <el-tooltip class="item" effect="dark" :content="data.name" placement="top">
                                <span>
                                  {{data.name}}
                                </span>
                              </el-tooltip>
                            </div>
                            <!-- 全选 -->
                            <span class="midFont set selectAll-tips" @click="handleSelectAll(data, 'handleNodeCheckChange')">{{$t('fConfig.selectAll')}}</span>
                          </div>
                        </div>
                        <div class="tree-node" v-else>
                          <div class="executeVarietiesName">
                            <tooltips :value="data.executeVarietiesName">
                            </tooltips>
                          </div>
                          <div class="varietiesCode">
                            <tooltips :value="data.varietiesCode || '/'">
                            </tooltips>
                          </div>
                          <div class="executeStandards">
                            <tooltips :value="data.executeStandards || '/'">
                            </tooltips>
                          </div>
                          <div class="models">
                            <tooltips :value="data.models || '/'">
                            </tooltips>
                          </div>
                          <div class="brand">
                            <tooltips :value="data.brand || '/'">
                            </tooltips>
                          </div>
                          <div class="executeUnit">
                            <tooltips :value="data.executeUnit || '/'">
                            </tooltips>
                          </div>
                          <div class="checkRemark">
                            <tooltips :value="data.checkRemark || '/'">
                            </tooltips>
                          </div>
                          <div class="quantity">
                            <tooltips :value="data.quantity || ''">
                            </tooltips>
                          </div>
                          <div class="waitWarIncomingQuantity">
                            <tooltips :value="data.waitWarIncomingQuantity || ''">
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
          <!-- 历史到货验收/临时租赁 -->
          <el-tab-pane :label="$t('warIncoming.historyCheckarrivalSporadicDetail')" name="second">
            <div class="title">
              <div class="title-name">
                {{$t(varietiesTitle)}}
              </div>
              <el-input v-model.trim="varietiesName" prefix-icon="el-icon-search"
                :placeholder="$t('tips.varietiesNameTips')" size="small" clearable @keyup.enter.native="sysHandleSearch"
                maxlength="64"></el-input>
            </div>
            <div class="cons-table-t content" :style="{height: `${dialogHeight - 195}px`}">
              <div class="fixed-scroll" style="display: flex;flex-direction: column;">
                <div class="treeTitle">
                  <div v-for="item in alreadyMainTable.tableList" :key="item.prop" :class="item.prop">
                    {{$t(item.label)}}
                  </div>
                </div>
                <div class="treeCons">
                  <div class="fixed-scroll">
                    <el-tree :data="alreadyMainTable.tableData.filter(v => v.sourceType === sourceType)" ref="alreadyTree" node-key="rowKey" :props='props'
                      class="tree-content" :default-expanded-keys="[1]" :filter-node-method="filterNode"
                      :default-checked-keys="selectId" :load="loadNode" lazy @node-click="handleNodeCheckChange">
                      <template slot="empty">
                        <no-data>
                        </no-data>
                      </template>
                      <div class="custom-tree-node" slot-scope="{node, data}" :class="'level' + data.level">
                        <div class="tree-node" v-if="node.level === 1">
                          <div class="executeVarietiesName">
                            <tooltips :value="data.executeVarietiesName">
                            </tooltips>
                          </div>
                        </div>
                        <div class="tree-node" v-else-if="node.level === 2">
                          <div class="selectAll">
                            <div class="selectAll-name ellipsis">
                              <el-tooltip class="item" effect="dark" :content="data.name" placement="top">
                                <span>
                                  {{data.name}}
                                </span>
                              </el-tooltip>
                            </div>
                            <!-- 全选 -->
                            <span class="midFont set selectAll-tips" @click="handleSelectAll(data, 'handleNodeCheckChange')">{{$t('fConfig.selectAll')}}</span>
                          </div>
                        </div>
                        <div class="tree-node" v-else>
                          <div class="executeVarietiesName">
                            <tooltips :value="data.executeVarietiesName">
                            </tooltips>
                          </div>
                          <div class="varietiesCode">
                            <tooltips :value="data.varietiesCode || '/'">
                            </tooltips>
                          </div>
                          <div class="executeStandards">
                            <tooltips :value="data.executeStandards || '/'">
                            </tooltips>
                          </div>
                          <div class="models">
                            <tooltips :value="data.models || '/'">
                            </tooltips>
                          </div>
                          <div class="brand">
                            <tooltips :value="data.brand || '/'">
                            </tooltips>
                          </div>
                          <div class="executeUnit">
                            <tooltips :value="data.executeUnit || '/'">
                            </tooltips>
                          </div>
                          <div class="checkRemark">
                            <tooltips :value="data.checkRemark || '/'">
                            </tooltips>
                          </div>
                          <div class="quantity">
                            <tooltips :value="data.quantity || ''">
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
  name: 'checkarrivalSporadicDetail',
  mixins: [search],
  data () {
    return {
      loading: false,
      props: {
        label: 'varietiesName',
        children: 'children',
        isLeaf: 'leaf'
      },
      mainTable: {
        // 表格数据
        tableData: [
          // 到货验收
          {
            id: -1, varietiesId: -1, sourceType: '01', rowKey: '01', api: 'getCheckarrivalDetailList',
            contractKey: 'expendContractId',
            executeVarietiesName: this.$t('dialog.checkarrival'), varietiesCode: '', executeStandards: '', executeUnit: '', leaf: false
          },
          // 零星采购
          {
            id: -2, varietiesId: -2, sourceType: '02', rowKey: '02', api: 'getSporadicDetailList',
            contractKey: 'sporadicPurchaseId',
            executeVarietiesName: this.$t('dialog.sporadic'), varietiesCode: '', executeStandards: '', executeUnit: '', leaf: false
          }
        ],
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
          { show: true, prop: 'executeUnit', label: 'fConfig.unit'},
          // 备注
          { show: true, prop: 'checkRemark', label: 'fConfig.remarks' },
          // 验收通过数量
          { show: true, prop: 'quantity', label: 'warIncoming.quantity' },
          // 待入库数量
          { show: true, prop: 'waitWarIncomingQuantity', label: 'warIncoming.waitWarIncomingQuantity' }
        ]
      },
      alreadyMainTable: {
        // 表格数据
        tableData: [
          // 到货验收
          {
            id: -1, varietiesId: -1, sourceType: '01', rowKey: '01', api: 'getAlreadyCheckarrivalDetailList',
            contractKey: 'expendContractId',
            executeVarietiesName: this.$t('dialog.checkarrival'), varietiesCode: '', executeStandards: '', executeUnit: '', leaf: false
          },
          // 零星采购
          {
            id: -2, varietiesId: -2, sourceType: '02', rowKey: '02', api: 'getAlreadySporadicDetailList',
            contractKey: 'sporadicPurchaseId',
            executeVarietiesName: this.$t('dialog.sporadic'), varietiesCode: '', executeStandards: '', executeUnit: '', leaf: false
          }
        ],
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
          { show: true, prop: 'executeUnit', label: 'fConfig.unit'},
          // 备注
          { show: true, prop: 'checkRemark', label: 'fConfig.remarks' },
          // 数量
          { show: true, prop: 'quantity', label: 'fConfig.quantity' }
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
          { show: true, prop: 'executeVarietiesName', label: 'fConfig.varietiesName', minWidth: '140' },
          // 规格
          { show: true, prop: 'executeStandards', label: 'fConfig.standards', minWidth: '100' },
          // 型号
          { show: true, prop: 'models', label: 'fConfig.models', minWidth: '60' },
          // 品牌
          { show: true, prop: 'brand', label: 'fConfig.brand', minWidth: '60' },
          // 单位
          { show: true, prop: 'executeUnit', label: 'fConfig.unit', minWidth: '60' },
          // 备注
          { show: true, prop: 'checkRemark', label: 'warIncoming.checkRemark', minWidth: '150' }
          // // 数量
          // { show: true, prop: 'quantity', label: 'fConfig.quantity', minWidth: '60' }

        ]
      },
      varietiesName: '',
      // =====================
      tableSeleList: [],
      selectId: [],
      temTableData: [],
      activeName: 'first'
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
      default: () => []
    },
    projectId: {
      default: 0
    },
    supplierId: {
      default: 0
    },
    expendContractId: {
      default: ''
    },
    sourceType: {
      default: '01'
    }
  },
  async created () {
    this.selectMainTable.maxHeight = this.dialogHeight - 140;
    this.mainTable.maxHeight = this.dialogHeight - 195;
    this.selectId = this.selectList.map(v => v.rowKey);
    const selectList = this.$clone(this.selectList);
    selectList.forEach((item, index) => {
      item.executeVarietiesName = item.materialName ? item.materialName : item.varietiesName;
      item.rowKey = `${item.sourceType}-${item.preMainId}-${item.eId}-${item.varietiesId}-${index}`;
    });
    this.selectMainTable.tableData = selectList;
  },
  methods: {
    // tab页切换
    handleClick (tab, event) {
      console.log(tab, event);
    },
    // 懒加载数据
    loadNode (node, resolve) {
      if (node.level === 0) {
        return resolve(node.data);
      }
      if (node.level === 1) {
        const data = {
          projectId: this.projectId,
          supplierId: this.supplierId,
          varietiesName: this.varietiesName
        };
        if (node.data.contractKey === 'expendContractId') {
          data[node.data.contractKey] = this.expendContractId;
        }
        this.$store.dispatch(`warIncoming/${node.data.api}`, data).then(res => {
          if (res.status === 0) {
            const results = res.results;
            res.results.forEach((item, index) => {
              item.sourceType = node.data.sourceType;
              item.children = node.data.sourceType === '01' ? item.checkArrivalDetails : item.sporadicPurchaseDetails;
              item.rowKey = `${item.sourceType}-${index}`;
              const purchaseContent = (node.data.sourceType === '02' && item.purchaseContent) ? `/${item.purchaseContent}` : '';
              item.name = `${item.docNo}/${this.$utils.commonUtil.formatDate(item.createTime)}/${item.createByName}${purchaseContent}`;
              item.children.forEach((child, index) => {
                child.waitWarIncomingQuantity =
                parseInt((Number(child.quantity) - Number(child.incomingQuantity)).toString(), 10) === parseFloat(Number(child.quantity) - Number(child.incomingQuantity))
                ? Number(child.quantity) - Number(child.incomingQuantity)
                : (Number(child.quantity) - Number(child.incomingQuantity)).toFixed(4);
              });
            });
            return resolve(results);
          } else {
            return resolve([]);
          }
        });
      }
      if (node.level === 2) {
        node.data.children.forEach(item => {
          item.leaf = true;
          item.eId = item.id;
          item.checkRemark = item.checkRemarks || item.remarks;
          item.rowKey = `${item.sourceType}-${item.preMainId}-${item.eId}-${item.varietiesId}`;
          this.$set(item, 'isopen', true);
        });
        return resolve(node.data.children);
      }
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
        for (const item of data.children) {
          if (!item.isopen) {
            item.leaf = true;
            item.eId = item.id;
            item.checkRemark = item.checkRemarks || item.remarks;
            item.rowKey = `${item.sourceType}-${item.preMainId}-${item.eId}-${item.varietiesId}`;
            this.$set(item, 'isopen', true);
          }
          this[funType](item);
        }
      }
    },
    handleCheckChange (data, checked, indeterminate) {
      this.temTableData = [];
      const temTableAlreadyData = [];
      const selectAlreadyVarietiesList = this.$refs.alreadyTree.getCheckedNodes().filter(v => v.varietiesId > 0);
      const selectVarietiesList = this.$refs.tree.getCheckedNodes().filter(v => v.varietiesId > 0);
      const selectList = this.$clone(this.selectList);
      if (selectList.length) {
        selectList.forEach(sele => {
          sele.executeVarietiesName = sele.materialName ? sele.materialName : sele.executeVarietiesName;
          const key = selectVarietiesList.findIndex(item => `${item.sourceType}-${item.preMainId}-${item.id}-${item.varietiesId}` === sele.rowKey);
          if (key < 0) {
            this.temTableData.push(sele);
          }
        });
        selectList.forEach(sele => {
          sele.executeVarietiesName = sele.materialName ? sele.materialName : sele.executeVarietiesName;
          const key = selectAlreadyVarietiesList.findIndex(item => `${item.sourceType}-${item.preMainId}-${item.id}-${item.varietiesId}` === sele.rowKey);
          if (key < 0) {
            temTableAlreadyData.push(sele);
          }
        });
      }
      const mergeTableData = this.temTableData.concat(temTableAlreadyData);
      this.selectMainTable.tableData = this.unique(selectVarietiesList.concat(selectAlreadyVarietiesList, this.unique(mergeTableData)));
    },
    // 点击行
    handleNodeCheckChange (data, node) {
      if (data.varietiesId > 0) {
        const val = this.$clone(data);
        val.isNew = true;
        val.rowKey = `${val.sourceType}-${val.preMainId}-${val.eId}-${val.varietiesId}-${this.selectMainTable.tableData.length + 1}`;
        this.selectMainTable.tableData.push(val);
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
    handleCheckAlreadyChange (data, checked, indeterminate) {
      this.temTableData = [];
      const selectAlreadyVarietiesList = this.$refs.alreadyTree.getCheckedNodes().filter(v => v.varietiesId > 0);
      const selectVarietiesList = this.$refs.tree.getCheckedNodes().filter(v => v.varietiesId > 0);
      const selectList = this.$clone(this.selectList);
      if (selectList.length) {
        selectList.forEach(sele => {
          sele.executeVarietiesName = sele.materialName ? sele.materialName : sele.executeVarietiesName;
          const key = selectAlreadyVarietiesList.findIndex(item => `${item.sourceType}-${item.preMainId}-${item.id}-${item.varietiesId}` === sele.rowKey);
          if (key < 0) {
            this.temTableData.push(sele);
          }
          const index = selectVarietiesList.findIndex(item => `${item.sourceType}-${item.preMainId}-${item.id}-${item.varietiesId}` === sele.rowKey);
          if (index < 0) {
            this.temTableData.push(sele);
          }
        });
      }
      this.selectMainTable.tableData = selectVarietiesList.concat(this.temTableData, selectAlreadyVarietiesList);
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
  .executeVarietiesName {
    min-width: 120px;
    width: calc(100% - 620px);
    padding-left: 10px;
    box-sizing: border-box;
  }
  .varietiesCode {
    width: 100px;
  }
  .executeStandards {
    width: 80px;
  }
  .executeUnit {
    width: 60px;
  }
  .models{
    width: 60px;
  }
  .brand{
    width: 60px;
  }
  .checkRemark{
    width: 60px;
  }
  .quantity{
    width: 100px;
  }
  .waitWarIncomingQuantity{
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
    width: 100%;
    height: 40px;
    line-height: 40px;
    box-sizing: border-box;
    border-bottom: 1px solid #ebeef5;
  }
  .custom-tree-node {
    width: 100%;
    flex-direction: row;
    height: 100%;
    flex: 1;
    text-align: left;
    overflow: hidden;
    .selectAll{
      display: flex;
      width: 100%;
      overflow: hidden;
      .selectAll-name{
        width: calc(100% - 50px);
        overflow: hidden;
      }
      .selectAll-tips{
        display: inline-block;
        width: 50px;
      }
    }
    .executeVarietiesName {
      min-width: 100px;
      float: left;
      height: 100%;
      width: calc(100% - 620px);
    }
    .varietiesCode {
      width: 100px;
      height: 100%;
      float: left;
    }
    .executeStandards {
      width: 80px;
      height: 100%;
      float: left;
    }
    .executeUnit {
      width: 60px;
      height: 100%;
      float: left;
    }
    .models{
      width: 60px;
      height: 100%;
      float: left;
    }
    .brand{
      width: 60px;
      height: 100%;
      float: left;
    }
    .checkRemark{
      width: 60px;
      height: 100%;
      float: left;
    }
    .quantity{
      width: 100px;
      height: 100%;
      float: left;
    }
    .waitWarIncomingQuantity{
      min-width: 50px;
      height: 100%;
      float: left;
    }
  }
}
.imgUrlList {
  display: inline-block;
  vertical-align: top;
  overflow: hidden;
}
</style>
