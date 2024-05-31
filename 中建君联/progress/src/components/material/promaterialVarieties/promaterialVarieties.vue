<template>
  <div class="materialVarieties">
    <div class="materialVarieties-cont">
        <div class="left" v-loading="loading" :element-loading-text="$t('tips.loadingText')">
            <div class="title">
                <div class="title-name">
                  {{$t(varietiesTitle)}}
                </div>
                <el-input v-model="varietiesName"
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
                                    <div class="varietiesName">
                                        <tooltips :value="`${data.demandPlanTypeValue} / ${data.applyType}`">
                                        </tooltips>
                                    </div>
                                  </div>
                                  <div class="tree-node" v-else>
                                    <div class="varietiesName">
                                        <tooltips :value="data.varietiesName">
                                        </tooltips>
                                    </div>
                                    <div class="varietiesCode">
                                        <tooltips :value="data.varietiesCode">
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
    name: 'promaterialVarieties',
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
            tableData: [],
            // 子系统表头渲染参数
            tableList: [
                // 材料品种名称
                {show: true, prop: 'varietiesName', label: 'fConfig.varietiesName'},
                // 材料品种编码
                {show: true, prop: 'varietiesCode', label: 'fConfig.varietiesCode'},
                // 规格
                {show: true, prop: 'standards', label: 'fConfig.standards'},
                // 单位
                {show: true, prop: 'unit', label: 'fConfig.unit'}
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
                {show: true, prop: 'varietiesCode', label: 'fConfig.varietiesCode', minWidth: '120'},
                // 材料品种名称
                {show: true, prop: 'varietiesName', label: 'fConfig.varietiesName'},
                // 规格
                {show: true, prop: 'standards', label: 'fConfig.standards', minWidth: '100'},
                // 单位
                {show: true, prop: 'unit', label: 'fConfig.unit', minWidth: '60'}
            ]
        },
        varietiesName: '',
        // =====================
        tableSeleList: [],
        varietiesDateilUrl: '',
        selectId: [],
        temTableData: []
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
      this.mainTable.maxHeight = this.dialogHeight - 140;
      this.varietiesDateilUrl = 'promaterialPurchaseApply/getDemandPurchaseApply';
      this.getVarietiesDateilList();
    },
    methods: {
        // 获取材料明细 /demand/month/purchase/apply/plan
        getVarietiesDateilList () {
            this.loading = true;
            const data = {
                projectId: this.projectId,
                varietiesName: this.varietiesName
            };
            if (this.promaterialTtype === 'warIncoming') {
                this.getWarIncomingPage(data);
                return;
            }
            this.$store.dispatch(this.varietiesDateilUrl, data).then(res => {
                if (res.status === 0) {
                    this.temTableData = [];
                    const selectList = [];
                    const selectIds = [];
                    for (const item of this.selectList) {
                        selectIds.push(`${item.demandPlanTypeCode}-${item.demandPlanId}-${item.varietiesId}`);
                    }
                    this.selectId = selectIds; // 默认勾选
                    res.results.forEach(item => {
                        item.demandPlanTypeCode === '02' &&
                        (item.applyType = `${item.applyType.substr(0, item.applyType.length - 1)}/${item.applyType.substr(item.applyType.length - 1, 1)}`);
                        item.children = this.$clone(item.demandPlanSummaryDetailResultDtos);
                        item.children.forEach(val => {
                            val.rowKey = `${val.demandPlanTypeCode}-${val.demandPlanId}-${val.varietiesId}`;
                            const index = this.selectList.findIndex(v => `${v.demandPlanTypeCode}-${v.demandPlanId}-${v.varietiesId}` === val.rowKey);
                            if (index >= 0) {
                                selectList.push(val);
                            }
                        });
                    });
                    this.selectList.forEach(sele => {
                        const key = selectList.findIndex(v => `${v.demandPlanTypeCode}-${v.demandPlanId}-${v.varietiesId}` ===
                        `${sele.demandPlanTypeCode}-${sele.demandPlanId}-${sele.varietiesId}`);
                        if (key < 0) {
                            this.temTableData.push(sele);
                        }
                    });
                    this.selectId = selectIds;
                    this.selectMainTable.tableData = selectList.concat(this.temTableData);
                    this.mainTable.tableData = res.results;
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
        getWarIncomingPage(data) {
            this.$store.dispatch(this.varietiesDateilUrl, data).then(res => {
                if (res.status === 0) {
                    this.temTableData = [];
                    const selectList = [];
                    const selectIds = [];
                    for (const item of this.selectList) {
                        selectIds.push(`${item.preDocNo}-${item.eId}-${item.varietiesId}`);
                    }
                    this.selectId = selectIds; // 默认勾选
                    res.results.forEach(item => {
                        // item.demandPlanTypeCode === '02' &&
                        // (item.applyType = `${item.applyType.substr(0, item.applyType.length - 1)}/${item.applyType.substr(item.applyType.length - 1, 1)}`);
                        item.children = this.$clone(item.demandPlanSummaryDetailResultDtos);
                        item.children.forEach(val => {
                            val.preDocNo = val.docNo;
                            val.eId = val.id;
                            val.sourceType = item.demandPlanTypeCode;
                            val.preMainId = item.id;
                            val.demandDurationQuantity = val.currentApplyQuantity;
                            console.log(val, 'val');
                            val.rowKey = `${val.preDocNo}-${val.eId}-${val.varietiesId}`;
                            const index = this.selectList.findIndex(v => `${v.preDocNo}-${v.eId}-${v.varietiesId}` === val.rowKey);
                            if (index >= 0) {
                                selectList.push(val);
                            }
                        });
                    });
                    this.selectList.forEach(sele => {
                        const key = selectList.findIndex(v => `${v.preDocNo}-${v.eId}-${v.varietiesId}` ===
                        `${sele.preDocNo}-${sele.eId}-${sele.varietiesId}`);
                        if (key < 0) {
                            this.temTableData.push(sele);
                        }
                    });
                    this.selectId = selectIds;
                    this.selectMainTable.tableData = selectList.concat(this.temTableData);
                    this.mainTable.tableData = res.results;
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
        // 搜索
        sysHandleSearch() {
          this.$refs.tree.filter(this.varietiesName);
        },
        // 条件过滤
        filterNode(value, data) {
            if (!value) return true;
            const code = `${data.varietiesCode}${data.varietiesName}${data.standards}${data.unit}`;
            return code.indexOf(value) !== -1;
        },
        handleCheckChange(data, checked, indeterminate) {
          const selectVarietiesList = this.$refs.tree.getCheckedNodes();
          this.selectMainTable.tableData = selectVarietiesList.filter(v => v.varietiesId > 0).concat(this.temTableData);
        },
        // 点击行
        handleNodeCheckChange(data, node) {
            if (data.varietiesId > 0) {
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
    .varietiesName {
      width: calc(100% - 280px);
      padding-left: 10px;
      box-sizing: border-box;
    }
    .varietiesCode{
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
    // background: pink;
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
            .varietiesName {
                float: left;
                height: 100%;
                width: calc(100% - 280px);
            }
            .varietiesCode{
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
</style>
