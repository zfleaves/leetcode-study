
<template>
  <div class="materialVarieties">
    <div class="materialVarieties-cont">
        <div class="left" v-loading="loading" :element-loading-text="$t('tips.loadingText')">
            <div class="title">
                <div class="title-name">
                  {{$t(varietiesTitle)}}
                </div>
                <el-input v-model="workerName"
                    @keyup.enter.native="getSearchList"
                    prefix-icon="el-icon-search"
                    :placeholder="$t('dialog.costMaterialName')"
                    size="small"
                    clearable
                    maxlength="64">
                </el-input>
            </div>
            <g-query-table
                :config="mainTable"
                @tableList="getTableSeleList">
            </g-query-table>
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
    name: 'labourWorkerDetail',
    mixins: [search],
    data () {
      return {
        loading: false,
        mainTable: {
            rowKey: 'masterPlanResourceDetailId',
            // 多选
            isCheckbox: true,
            selectedList: [],
            // 表格数据
            tableData: [],
            // 表格高度
            maxHeight: 500,
            // 子系统表头渲染参数
            tableList: [
                // 名称
                { show: true, label: 'dialog.costMaterialName', prop: 'resourceDetailName', formType: 'text' },
                // 规格
                { show: true, label: 'fConfig.standards', prop: 'standards', formType: 'text', minWidth: 120 },
                // 单位
                { show: true, label: 'fConfig.unit', prop: 'unit', formType: 'text', minWidth: 80 },
                // 资源分解数量
                { show: true, label: 'fConfig.resourceQuantity', prop: 'resourceQuantity', formType: 'text', minWidth: 120 },
                // 已投入数量
                { show: true, label: 'fConfig.alreadyQuantity', prop: 'alreadyQuantity', formType: 'text', minWidth: 120}
            ]
        },
        selectMainTable: {
            rowKey: 'masterPlanResourceDetailId',
            // 表格数据
            tableData: [],
            // 表格高度
            maxHeight: 500,
            // 子系统表头渲染参数
            tableList: [
                // 名称
                { show: true, label: 'dialog.costMaterialName', prop: 'resourceDetailName', formType: 'text' },
                // 规格
                { show: true, label: 'fConfig.standards', prop: 'standards', formType: 'text', minWidth: 120 },
                // 单位
                { show: true, label: 'fConfig.unit', prop: 'unit', formType: 'text', minWidth: 80 },
                // 资源分解数量
                { show: true, label: 'fConfig.resourceQuantity', prop: 'resourceQuantity', formType: 'text', minWidth: 120 },
                // 已投入数量
                { show: true, label: 'fConfig.alreadyQuantity', prop: 'alreadyQuantity', formType: 'text', minWidth: 120}
            ]
        },
        tempData: [],
        workerName: '',
        // =====================
        tableSeleList: [],
        tempWorkerIdCard: '',
        checkList: [],
        list: []
      };
    },
    props: {
        dialogHeight: {
            type: Number,
            default: 300
        },
        selectList: {
            type: Array,
            default: () => []
        },
        // 左侧的展示标题
        varietiesTitle: {
          type: String,
          default: 'dialog.mainResouse'
        },
        projectId: {
            default: 0
        },
        row: {
            type: Object,
            default: () => {}
        },
        currentTable: {
            type: Object,
            default: () => {}
        },
        varietiesDateilUrl: {
            type: String,
            default: 'demMasterPlan/getPlanLogList'
        }
    },
    async created () {
        this.checkList = this.$clone(this.selectList);
        this._getTableDataList();
        this.selectMainTable.maxHeight = this.dialogHeight - 140;
        this.mainTable.maxHeight = this.dialogHeight - 140;
    },
    methods: {
        getSearchList() {
            if (this.workerName) {
                this.mainTable.tableData = this.tempData.filter(v => v.resourceDetailName.indexOf(this.workerName) >= 0);
            } else {
                this.mainTable.tableData = JSON.parse(JSON.stringify(this.tempData));
            }
        },
        // 年/季
        _getTableDataList () {
            console.log(this.row, 'row');
            this.loading = true;
            const data = {
                projectId: this.projectId
            };
            this.$store.dispatch(this.varietiesDateilUrl, data).then(res => {
                if (res.status === 0) {
                    console.log(res, 'res');
                    const results = res.results.length ? res.results[0] : { demMasterPlanGants: []};
                    this.getResouceList(results.demMasterPlanGants);
                    console.log(this.list, 'list');
                    //  &&
                    //     v.gantResourceId === this.row.gantResourceId
                    const currentDetails = this.list.filter(v => v.resourceTypeCode === this.currentTable.costTypeCode &&
                        v.gantResourceId === this.row.gantResourceId);
                    for (const item of currentDetails) {
                        item.dataSourceValue = '主计划';
                        item.dataSourceCode = '03';
                        item.resourceQuantity = item.quantity;
                        item.quantity = '';
                        item.gantResourceDetailId = item.id;
                        item.masterPlanResourceDetailId = item.id;
                        item.cid = this.row.cid;
                        delete item.id;
                        item.includeTaxAmount = '';
                        // item.includeUnitPrice = '';
                        item.taxAmount = '';
                        // item.taxRate = '';
                        item.excludeTaxAmount = '';
                        item.excludeUnitPrice = '';
                        const index = this.checkList.findIndex(v => v.masterPlanResourceDetailId === item.masterPlanResourceDetailId);
                        if (index >= 0) {
                            this.mainTable.selectedList.push({masterPlanResourceDetailId: item.masterPlanResourceDetailId});
                            this.checkList.splice(index, 1);
                        }
                    }
                    console.log(currentDetails, 'currentDetails');
                    this.tempData = this.$clone(currentDetails);
                    this.mainTable.tableData = this.$clone(currentDetails);
                    this.loading = false;
                } else {
                    this.$message.error(this.$t(`exception.${res.errorCode}`));
                }
                this.loading = false;
            }).catch(e => {
                console.log(e);
                this.loading = false;
            });
        },
        getResouceList(arr) {
            for (const item of arr) {
                if (item.children && item.children.length) {
                    this.getResouceList(item.children);
                } else if (item.leaf === 1) {
                    // console.log(item.details, 'item.details');
                    if (item.details && item.details.length) {
                        for (const child of item.details) {
                            for (const second of child.details) {
                                second.cid = child.cid;
                                this.list.push(second);
                            }
                        }
                    }
                }
            }
        },
        // 获取选中的数据
        getTableSeleList(arr) {
            this.tableSeleList = arr;
            this.selectMainTable.tableData = this.checkList.concat(arr);
        },
        // 传出
        handleDialogStatus(status) {
            const checkTableData = JSON.parse(JSON.stringify(this.selectMainTable.tableData));
            if (status === 'close') {
                this.$emit('update:close', false);
            } else {
                this.$emit('getData', checkTableData);
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
                      min-width: 100px;
                      width: 40%;
                  }
              }
          }
          .right{
              flex: 5;
              max-width: 50%;
              .title{
                  align-items: center;
                  // height: 36px;
                  margin: 10px 0;
              }
          }
      }
}
.cons {
  background-color: #fff;
  color: #303133;
  padding: 10px;
  transition: .3s;
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
    .classifyName {
      width: calc(100% - 950px);
      padding-left: 10px;
      box-sizing: border-box;
    }
    .classifyCode {
      width: 150px;
    }
    .classifyDiscription{
      width: 200px;
    }
    .createByName{
      width: 100px;
    }
    .updateByName{
      width: 100px;
    }
    .updateTime{
      width: 120px;
    }
    .sorts{
      width: 100px;
    }
    .operate {
      width: 180px;
      text-align: center;
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
        // display: flex;
        flex-direction: row;
        height: 100%;
        flex: 1;
        text-align: left;
        .classifyName {
          float: left;
          height: 100%;
          width: calc(100% - 950px);
        }
        .classifyCode {
          width: 150px;
          height: 100%;
          float: left;
        }
        .classifyDiscription{
          width: 200px;
          height: 100%;
          float: left;
        }
        .createByName{
          width: 100px;
          height: 100%;
          float: left;
        }
        .updateByName{
          width: 100px;
          height: 100%;
          float: left;
        }
        .updateTime{
          width: 120px;
          height: 100%;
          float: left;
        }
        .sorts{
          width: 100px;
          height: 100%;
          float: left;
        }
        .operate {
          width: 180px;
          height: 100%;
        }
    }
}
.imgUrlList{
  display: inline-block;
  vertical-align: top;
  overflow: hidden;
}
</style>
