<template>
  <div class="materialVarieties">
    <div class="materialVarieties-cont">
        <div class="left" v-loading="loading" :element-loading-text="$t('tips.loadingText')">
            <div class="title">
                <div class="title-name">
                  {{$t(varietiesTitle)}}
                </div>
                <el-input v-model="materialName"
                    prefix-icon="el-icon-search"
                    :placeholder="$t('tips.varietiesNameTips')"
                    size="small"
                    clearable
                    @keyup.enter.native="sysHandleSearch"
                    maxlength="64"></el-input>
            </div>
            <div class="cons-table-t content" :style="{height: `${dialogHeight - 140}px`}">
              <div class="fixed-scroll" style="display: flex;flex-direction: column;">
                <div class="treeTitle">
                  <div v-for="item in mainTable.tableList" :key="item.prop" :class="item.prop">
                    {{$t(item.label)}}
                  </div>
                </div>
                <div class="treeCons">
                    <div class="fixed-scroll">
                        <el-tree
                            :data="mainTable.tableData" ref="tree"
                            node-key="rowKey" :props='props'
                            class="tree-content"
                            :default-expanded-keys="[1]"
                            :filter-node-method="filterNode"
                            :default-checked-keys="selectId"
                            show-checkbox
                            @node-click="handleNodeCheckChange"
                            @check-change="handleCheckChange">
                            <template slot="empty">
                              <no-data>
                              </no-data>
                            </template>
                              <div class="custom-tree-node" slot-scope="{ node, data }" :class="'level' + data.level">
                                  <div class="tree-node" v-if="node.level === 1">
                                    <div class="materialName">
                                        <tooltips :value="`${data.docNo}-${data.purchaseContent}`">
                                        </tooltips>
                                    </div>
                                  </div>
                                  <div class="tree-node" v-else>
                                    <div class="materialName">
                                        <tooltips :value="data.materialName">
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
                                  </div>
                              </div>
                        </el-tree>
                    </div>
                </div>
              </div>
            </div>
        </div>
        <div class="right">
            <div class="title">{{$t('tips.selected')}}</div>
            <g-query-table
                :config="selectMainTable">
            </g-query-table>
        </div>
    </div>
    <div class="footer">
        <el-button class="urgent" type="primary" icon="el-icon-circle-close" size="small" @click="handleDialogStatus('close')">{{$t('button.close')}}</el-button>
        <el-button size="small" type="primary" icon="el-icon-circle-check" @click="handleDialogStatus('save')" v-fast-click>{{$t('button.determine')}}</el-button>
    </div>
  </div>
</template>

<script>
  import {search} from 'mixins/searchMixins';

  export default {
    name: 'purchaseApplyDetail',
    mixins: [search],
    data () {
      return {
        loading: false,
        props: {
          label: 'materialName',
          children: 'children',
          isLeaf: 'leaf'
        },
        mainTable: {
            rowKey: 'rowKey',
            // 表格数据
            tableData: [],
            // 子系统表头渲染参数
            tableList: [
                // 机械品种名称
                {show: true, prop: 'materialName', label: 'dialog.costMaterialName'},
                // 规格
                {show: true, prop: 'executeStandards', label: 'fConfig.standards'},
                {show: true, prop: 'models', label: 'fConfig.models'},
                {show: true, prop: 'brand', label: 'fConfig.brand'},
                // 单位
                {show: true, prop: 'executeUnit', label: 'fConfig.unit'}
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
                // 机械品种名称
                {show: true, prop: 'materialName', label: 'dialog.costMaterialName'},
                // 规格
                {show: true, prop: 'executeStandards', label: 'fConfig.standards', minWidth: '100'},
                {show: true, prop: 'models', label: 'fConfig.models'},
                {show: true, prop: 'brand', label: 'fConfig.brand'},
                // 单位
                {show: true, prop: 'executeUnit', label: 'fConfig.unit', minWidth: '60'}
            ]
        },
        materialName: '',
        // =====================
        tableSeleList: [],
        varietiesDateilUrl: '',
        selectId: [],
        checkList: []
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
        projectId: {
            default: 0
        },
        sporadicPurchaseIds: {
            default: () => []
        }
    },
    async created () {
      this.selectMainTable.maxHeight = this.dialogHeight - 140;
      this.mainTable.maxHeight = this.dialogHeight - 140;
      this.checkList = this.$clone(this.selectList);
      this.getVarietiesDateilList();
    },
    methods: {
        // 获取机械明细
        getVarietiesDateilList () {
            this.loading = true;
            const data = {
              docNo: '',
              projectId: this.projectId,
              queryParam: '',
              sporadicPurchaseIds: this.sporadicPurchaseIds.map(v => v.purchaseApplyId)
            };
            this.$store.dispatch('sporadicReimburse/getPurchaseDetail', data).then(res => {
                if (res.status === 0) {
                    const selectIds = [];
                    for (const item of this.selectList) {
                        selectIds.push(item.eId);
                    }
                    this.selectId = selectIds; // 默认勾选
                    res.results.forEach(item => {
                        item.rowKey = item.docNo;
                        item.children = this.$clone(item.sporadicPurchaseDetails);
                        item.children.forEach(val => {
                            this.$set(val, 'rowKey', val.id);
                            this.$set(val, 'eId', val.id);
                            this.$set(val, 'purchaseApplyId', item.id);
                            this.$set(val, 'purchaseApplyCode', item.docNo);
                            this.$set(val, 'materialName', val.executeVarietiesName);
                            const index = this.checkList.findIndex(v => v.eId === val.id);
                            if (index >= 0) {
                                this.checkList.splice(index, 1);
                            }
                        });
                    });
                    this.selectId = selectIds;
                    this.selectMainTable.tableData = this.selectList;
                    this.mainTable.tableData = res.results;
                } else {
                    this.$message.error(this.$t(`exception.${res.errorCode}`));
                }
                this.loading = false;
            }).catch(e => {
                this.loading = false;
            });
        },
        // 搜索
        sysHandleSearch() {
          this.$refs.tree.filter(this.materialName);
        },
        // 条件过滤
        filterNode(value, data) {
            if (!value) return true;
            const code = `${data.materialName}${data.executeStandards}${data.executeUnit}`;
            return code.indexOf(value) !== -1;
        },
        handleCheckChange() {
          const selectVarietiesList = this.$refs.tree.getCheckedNodes();
          console.log(this.checkList, 'this.checkList');
          this.selectMainTable.tableData = selectVarietiesList.filter(v => v.purchaseApplyId > 0).concat(this.checkList);
        },
        // 点击行
        handleNodeCheckChange(data, node) {
            if (data.purchaseApplyId > 0) {
                this.$refs.tree.setChecked(data.rowKey, !node.checked);
            }
        },
        // 传出
        handleDialogStatus(status) {
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
.materialVarieties{
    width: 100%;
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
    .materialVarieties-cont{
        width: 100%;
        display: flex;
        .left{
            flex: 5;
            max-width: 50%;
            margin-right: 20px;
            .title{
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 10px 0;
                .title-name{
                    width: 40%;
                    min-width: 100px;
                }
            }
            .content {
                position: relative;
                width: 100%;
            }
        }
        .right{
            flex: 5;
            max-width: 50%;
            .title{
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
    border: 1px solid #EBEEF5;
    background: #fafafa;
    line-height: 40px;
    color: #909399;
    text-align: left;
    font-size: 14px;
    font-weight: bold;
    .materialName {
      width: calc(100% - 380px);
      padding-left: 10px;
      box-sizing: border-box;
    }
    .brand{
      width: 100px;
    }
    .models{
      width: 100px;
    }
    .standards{
      width: 100px;
    }
    .unit{
      width: 80px;
    }
}
.treeCons {
    flex: 1;
    width: calc(100% - 2px);
    position: relative;
    border: 1px solid #EBEEF5;
    border-top: 0;
    /deep/ .el-tree-node__content {
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #EBEEF5;
    }
    .custom-tree-node {
        width: 100%;
        height: 100%;
        .tree-node{
            width: 100%;
            flex-direction: row;
            height: 100%;
            text-align: left;
            .materialName {
                float: left;
                height: 100%;
                width: calc(100% - 380px);
            }
            .brand{
                width: 100px;
                height: 100%;
                float: left;
            }
            .models{
                width: 100px;
                height: 100%;
                float: left;
            }
            .standards{
                width: 100px;
                height: 100%;
                float: left;
            }
            .unit{
                width: 80px;
                height: 100%;
                float: left;
            }
        }
    }
}
.imgUrlList{
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
