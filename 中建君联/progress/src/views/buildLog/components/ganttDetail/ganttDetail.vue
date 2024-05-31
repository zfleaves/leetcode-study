<!--
 * @Author: your name
 * @Date: 2021-02-01 09:40:25
 * @LastEditTime: 2022-03-04 10:16:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\components\material\ganttDetail\ganttDetail.vue
-->
<template>
  <div class="materialVarieties">
    <div class="materialVarieties-cont">
        <div class="left" v-loading="loading" :element-loading-text="$t('tips.loadingText')">
            <div class="title">
                <div class="title-name">
                  {{$t(varietiesTitle)}}
                </div>
                <el-input v-model="taskName"
                    prefix-icon="el-icon-search"
                    :placeholder="$t('dialog.taskNameTips')"
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
                            node-key="cid" :props='props'
                            :default-expanded-keys="[1]"
                            :filter-node-method="filterNode"
                            :default-checked-keys="selectId"
                            check-strictly
                            @node-click="handleNodeCheckChange">
                            <template slot="empty">
                              <no-data>
                              </no-data>
                            </template>
                              <div class="custom-tree-node" slot-scope="{data}" :class="'level' + data.level">
                                <div class="tree-node">
                                  <div class="taskName">
                                      <el-checkbox @change="handleNodeCheckChange(data)" v-model="data.checked" :disabled="data.disabled">
                                      </el-checkbox>
                                      <tooltips :value="data.taskName">
                                      </tooltips>
                                  </div>
                                  <div class="dutyUserName">
                                      <tooltips :value="data.dutyUserName">
                                      </tooltips>
                                  </div>
                                  <div class="planDuration">
                                      <tooltips :value="data.planDuration">
                                      </tooltips>
                                  </div>
                                  <div class="startDate">
                                      <tooltips :value="data.startDate | setDate">
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
    name: 'ganttDetail',
    mixins: [search],
    data () {
      return {
        loading: false,
        props: {
          label: 'taskName',
          children: 'children',
          isLeaf: 'leaf'
        },
        mainTable: {
            // 表格数据
            tableData: [],
            // 子系统表头渲染参数
            tableList: [
                // 任务名称
                {show: true, prop: 'taskName', label: 'dialog.taskName'},
                // 责任人
                {show: true, prop: 'dutyUserName', label: 'dialog.dutyUserName'},
                // 计划工期(days)
                {show: true, prop: 'planDuration', label: 'dialog.planDuration'},
                // 计划开始日期
                {show: true, prop: 'startDate', label: 'dialog.start_date', filterName: 'date'}
            ]
        },
        selectMainTable: {
            rowKey: 'cid',
            // 表格数据
            tableData: [],
            // 表格高度
            maxHeight: 500,
            // 子系统表头渲染参数
            tableList: [
                // 任务名称
                {show: true, prop: 'taskName', label: 'dialog.taskName'},
                // 责任人
                {show: true, prop: 'dutyUserName', label: 'dialog.dutyUserName'},
                // 计划工期(days)
                {show: true, prop: 'planDuration', label: 'dialog.planDuration'},
                // 计划开始日期
                {show: true, prop: 'startDate', label: 'dialog.start_date', filterName: 'date'}
            ]
        },
        taskName: '',
        // =====================
        tableSeleList: [],
        selectId: [],
        temTableData: [],
        workHours: 8
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
          default: 'dialog.demMasterPlan'
        },
        // 选中的品种
        selectList: {
            default: []
        },
        // 项目id
        projectId: {
            default: 0
        },
        isCheckBox: {
            type: Boolean,
            default: true
        },
        isParentCanCheck: {
            type: Boolean,
            default: false
        },
        varietiesDateilUrl: {
            type: String,
            default: 'demMasterPlan/getPlanLogList'
        }
    },
    async created () {
        this.selectMainTable.maxHeight = this.dialogHeight - 140;
        this.mainTable.maxHeight = this.dialogHeight - 140;
        // 获取工作时间
        this.getWorkTime();
    },
    methods: {
        async getWorkTime() {
            const timeRes = await this.$store.dispatch('projectCalendar/getWorktimeInfo', {projectId: this.projectId}).then();
            this.workHours = timeRes.results.workHours || 8;
            this.getVarietiesDateilList();
        },
        // 获取材料明细
        getVarietiesDateilList () {
            this.loading = true;
            const data = {
                projectId: this.projectId
            };
            this.$store.dispatch(this.varietiesDateilUrl, data).then(res => {
                if (res.status === 0) {
                    if (res.results && res.results.length) {
                        const results = res.results[0].demMasterPlanGants;
                        this.setTreeData(results);
                        this.mainTable.tableData = results;
                        console.log(results, 'results');
                    }
                } else {
                    this.$message.error(this.$t(`exception.${res.errorCode}`));
                }
                this.loading = false;
            }).catch(e => {
                this.loading = false;
            });
        },
        setTreeData(arr, taskNameList = []) {
            for (const item of arr) {
                item.taskName = item.text;
                item.taskNameList = taskNameList.concat([item.taskName]);
                const day = item.duration / this.workHours;
                item.planDuration = Number(day.toFixed(1));
                item.alreadyFinishedProgress = item.progress || 0;
                item.planStartDate = item.startDate; // 计划开始
                item.planFinishedDate = item.endDate; // 计划完成
                item.realFinishedDate = item.realEndDate || ''; // 实际完成
                // item.dutyUserName = '';
                const index = this.selectList.findIndex(v => v.cid === item.cid);
                if (index >= 0) {
                    this.$set(item, 'checked', true);
                    this.selectMainTable.tableData.push(item);
                } else {
                    this.$set(item, 'checked', false);
                }
                // 是否父亲节点不能选
                if (item.children && item.children.length) {
                    if (!this.isParentCanCheck) {
                        item.disabled = true;
                    }
                    this.setTreeData(item.children, item.taskNameList);
                    // return this.setTreeData(item.children, item.taskNameList);
                } else {
                    item.disabled = false;
                }
            }
        },
        // 搜索
        sysHandleSearch() {
          this.$refs.tree.filter(this.taskName);
        },
        // 条件过滤
        filterNode(value, data) {
            if (!value) return true;
            return data.taskName.indexOf(value) !== -1;
        },
        handleNodeCheckChange(data) {
          if (data.disabled) return;
          // 多选
          if (this.isCheckBox) {
            if (data.checked) {
                this.$set(data, 'checked', false);
            // this.setSelectMainTable(false, data);
            } else {
                this.$set(data, 'checked', true);
            }
            this.setSelectMainTable(data.checked, data);
            return;
          }
          // 单选
          if (data.checked) {
            this.$set(data, 'checked', false);
          } else {
            this.checkRadio(this.mainTable.tableData);
            this.$set(data, 'checked', true);
          }
          this.checkRadio(this.mainTable.tableData, data);
        },
        // 处理右边选中数据
        setSelectMainTable(checked, data) {
            if (checked) {
                console.log(data, 'data');
                const checkData = this.$clone(data);
                delete checkData.children;
                this.selectMainTable.tableData.push(checkData);
            } else {
                const index = this.selectMainTable.tableData.findIndex(v => v.cid === data.cid);
                if (index >= 0) {
                  this.selectMainTable.tableData.splice(index, 1);
                }
            }
        },
        // 设置勾选
        checkRadio (arr) {
            for (const i in arr) {
                const item = arr[i];
                this.$set(item, 'checked', false);
                if (item.children && item.children.length) {
                    this.checkRadio(item.children);
                }
            }
        },
        // 传出
        handleDialogStatus(status) {
            if (status === 'close') {
                this.$emit('update:close', false);
            } else {
                if (this.selectMainTable.tableData.length === 0) {
                    this.$message.error('dialog.demMasterPlanTaskTips');
                    return;
                }
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
    .taskName {
      min-width: 120px;
      width: calc(100% - 320px);
      padding-left: 10px;
      box-sizing: border-box;
    }
    .dutyUserName{
      width: 100px;
    }
    .planDuration{
      width: 100px;
    }
    .startDate{
      width: 120px;
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
        flex-direction: row;
        height: 40px;
        flex: 1;
        text-align: left;
        .taskName {
            min-width: 100px;
            float: left;
            height: 40px;
            width: calc(100% - 300px);
            display: flex;
            .el-checkbox {
                margin-right: 6px;
            }
            overflow: hidden;
        }
        .dutyUserName{
            width: 80px;
            height: 40px;
            float: left;
        }
        .planDuration{
            width: 100px;
            height: 40px;
            float: left;
        }
        .startDate{
            width: 120px;
            height: 40px;
            float: left;
        }
    }
}
.imgUrlList{
  display: inline-block;
  vertical-align: top;
  overflow: hidden;
}
</style>
