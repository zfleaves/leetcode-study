<!--
 * @Author: your name
 * @Date: 2020-07-17 14:55:27
 * @LastEditTime: 2022-10-12 17:43:06
 * @LastEditors: zengqin 1058574586@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_unit\src\components\basicComponents\process\monitorDailog.vue
-->
<template>
  <div class="processDefineWrap" :style="{height: dailogHeight - 30 + 'px'}" style="position: relative;">
    <div class="content">
      <div class="fixed-scroll">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <!-- 审批记录 -->
          <el-tab-pane :label="processType === 'scenarioFlow' ? $t('dialog.mattersHandled') : $t('dialog.approvalRecord')"
            name="second">
            <div class="is-scrolling" :style="{height: dailogHeight - 140 + 'px'}">
              <el-table :data="tableData" ref="multipleTable" border stripes>
                <el-table-column type="index" :label="$t('fConfig.serialNumber')" key="2" width="50">
                  <!-- 审批状态 -->
                </el-table-column><el-table-column :label="$t('fConfig.status')" align="center" width="50">
                  <template slot-scope="scope">
                    <div class="metf">
                      <div :class="handleStatus(scope.row,scope.$index)"></div>
                      <div :class="handleLine(scope.$index)"></div>
                    </div>
                  </template>
                </el-table-column>
                <!-- 节点名称 -->
                <el-table-column prop="nodeName" :label="$t('dialog.nodeName')" min-width="120" show-overflow-tooltip>
                </el-table-column>
                <!-- 处理类型 -->
                <el-table-column prop="approval" width="100" :label="$t('dialog.approval')" show-overflow-tooltip>
                </el-table-column>
                <!-- 处理意见 -->
                <el-table-column prop="comment" :label="$t('dialog.comment')" show-overflow-tooltip>
                </el-table-column>
                <!-- 处理人 -->
                <el-table-column prop="assigneeName" width="120" :label="$t('dialog.assigneeName')" show-overflow-tooltip>
                </el-table-column>
                <!-- 处理时间 -->
                <el-table-column :label="$t('dialog.executeDate')" width="160" class='father' show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span class="midFont">{{scope.row.executeDate | setTime}}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <!-- 流程图 -->
          <el-tab-pane :label="$t('dialog.flowChart')" name="first" v-if="processType !== 'scenarioFlow'">
            <div class="process">
              <div>
                <h3 style="text-align: center;width: 100%;">
                  {{processName}}
                  <span style="float: right;">
                    <span
                      style="display:inline-block; height:12px; width:12px; background:#4fba4f; margin-left:6px; vertical-align:middle;">
                    </span>
                    <!-- 已完成步骤 -->
                    <label style="vertical-align:middle;">{{$t('dialog.stepCompleted')}}</label>
                    <span
                      style="display:inline-block; height:12px; width:12px; background:#ff9001; margin-left:6px; vertical-align:middle;">
                    </span>
                    <!-- 待处理步骤 -->
                    <label style="vertical-align:middle;">{{$t('dialog.pendingSteps')}}</label>
                    <span
                      style="display:inline-block; height:12px; width:12px; background:#7e7e7f; margin-left:6px; vertical-align:middle;">
                    </span>
                    <!-- 未经过步骤 -->
                    <label style="vertical-align:middle;">{{$t('dialog.noSteps')}}</label>
                  </span>
                </h3>
              </div>
              <div class="processCons">
                <!--流程画布栏-->
                <div id="myDisplayDiv" style="width: 100%;">
                </div>
              </div>
            </div>
          </el-tab-pane>
          <!-- 处理事项 -->
          <el-tab-pane class="scenarioFlow" v-if="processType === 'scenarioFlow'" :label="$t('dialog.eventChart')"
            name="first">
            <div class="process">
              <div class="processCons">
                <el-steps style="width:100%" finish-status="success" :active="activeProcess" align-center>
                  <el-step v-for="item of processNodeMasters" :key="item.id" :title="item.nodeName" :icon="item.icon">
                  </el-step>
                </el-steps>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { FlowDisplay } from './flow-display';

export default {
  name: 'monitorDialog',
  data () {
    return {
      activeName: 'second',
      taskLogShow: false,
      processName: '',
      nodeObj: {
        class: 'go.GraphLinksModel',
        modelData: { 'position': '-5 -5' },
        nodeDataArray: [],
        linkDataArray: []
      },
      flag: false,
      myDisplay: '',
      text: '',
      formCode: '',
      processCode: '',
      typeList: [
        { nodeCode: 'BEGIN', figure: 'Circle', fill: '#4fba4f' },
        { nodeCode: 'APPROVAL', figure: 'Rectangle', fill: '#7e7e7f' },
        { nodeCode: 'COUNTERSIGN', figure: 'RoundedRectangle', fill: '#7e7e7f' },
        { nodeCode: 'DECIDE', figure: 'Diamond', fill: '#7e7e7f' },
        { nodeCode: 'TOLERANCE', figure: 'Diamond', fill: '#7e7e7f' },
        { nodeCode: 'EXCLUSION', figure: 'Diamond', fill: '#7e7e7f' },
        { nodeCode: 'PARALLEL', figure: 'Diamond', fill: '#7e7e7f' },
        { nodeCode: 'MERGE', figure: 'Diamond', fill: '#7e7e7f' },
        { nodeCode: 'END', figure: 'Circle', fill: '#7e7e7f' }
      ],
      nodeForm: '',
      nodeInfo: '',
      linkList: [],
      tableData: [],
      finishNode: [],
      finishLinkNode: [],
      approvalArr: [],
      currentProcessNodeCode: '',
      processType: '',
      processExecutionDiagram: [],
      activeProcess: 0,
      stepProcessCode: '',
      processNodeMasters: [],
      isLastRow: false // 是否为最后一行
    };
  },
  computed: {
    taskId () {
      return this.$store.state.diaLog.taskId;
    },
    dailogHeight () {
      return document.body.offsetHeight * 0.84 - 44 - 55;
    }
  },
  created () {
    this.processType = localStorage.getItem('processType');
  },
  beforeDestroy () {
    localStorage.removeItem('processType');
  },
  mounted () {
    if (this.processType === 'scenarioFlow') {
      this.getStepTaskInfo();
    } else {
      this.myDisplay = new FlowDisplay('myDisplayDiv');
      this._getCompanyTasksInfo();
    }
  },
  methods: {
    // 获取任务详情
    getStepTaskInfo () {
      this.$store.dispatch('publicApi/getStepTaskQueryInfoPublicApi', { taskId: this.taskId }).then(res => {
        if (res.status === 0) {
          this.stepProcessCode = res.results.processCode;
          this.getStepPublishProcessWin();
        }
      });
    },
    // 查询流程实例详细信息及其节点和连线信息
    getStepPublishProcessWin () {
      this.$store.dispatch('publicApi/getStepPublishProcessWinPublicApi', { processCode: this.stepProcessCode }).then(res => {
        if (res.status === 0 && res.results) {
          this.processNodeMasters = res.results.processNodeMasters;
          this.getStepTaskLogListPublicApi();
        }
      });
    },
    // 获取右侧信息列表
    getStepTaskLogListPublicApi () {
      this.$store.dispatch('publicApi/getStepTaskLogListPublicApi', { taskId: this.taskId }).then(res => {
        this.tableData = res.results;
        this.activeProcess = 0;
        for (const item of res.results) {
          const index = this.processNodeMasters.findIndex(v => v.processNodeCode === item.processNodeCode);
          if (index >= 0) {
            this.$set(this.processNodeMasters[index], 'status', item.status);
          }
        }
        this.activeProcess = this.processNodeMasters.filter(v => v.status === 0).length;
      });
    },
    handleClick () {

    },
    _getCompanyTasksInfo () {
      this.$store.dispatch('processApi/getTaskInfo', { taskId: this.taskId }).then(res => {
        const params = res.results;
        this.currentProcessNodeCode = params.currentProcessNodeCode;
        this.processCode = params.processCode;
        this.processName = `${params.taskName}-${this.$t('dialog.monitor')}`; // 监控
        this.flag = params.status === 0;
        this._getProcessNodeList();
      });
    },
    // 查询流程模版的节点和连接信息
    _getProcessNodeList () {
      this.$store.dispatch('processApi/getProcessNodeList', { processCode: this.processCode }).then(res => {
        const nodeObj = res.results;
        this.nodeObj.nodeDataArray = this.setNodeDataArray(nodeObj.processNodes);
        this.nodeObj.linkDataArray = this.setLinkDataArray(nodeObj.processNodeConnects);
        this.myDisplay.loadFlow(this.nodeObj);
        this._findWorkflowLogs();
      });
    },
    // 获取右侧信息列表
    _findWorkflowLogs () {
      this.$store.dispatch('processApi/getTasksQueryLogs', { taskId: this.taskId }).then(res => {
        this.tableData = res.results;
        this.showFlowPath();
      });
    },
    showFlowPath () {
      this.getNodeData1();
      const approvalArr = this.tableData.filter(v => v.status === 1);
      const handleNode1 = this.tableData.filter(v => v.status === 0 && v.nodeName !== '开始' && v.approval !== '驳回');
      this.finishNode = this.finishNode.concat(approvalArr);
      this.finishNode = this.finishNode.concat(handleNode1);
      this.myDisplay.animateFlowPath(this.finishNode, this.flag, this.finishLinkNode);
    },
    // 处理流程节点
    setNodeDataArray (arr) {
      const list = [];
      for (const i in arr) {
        const item = arr[i];
        item.key = item.processNodeCode;
        item.text = item.nodeName;
        item.width = 50;
        item.height = 50;
        const index = this.typeList.findIndex(v => v.nodeCode === item.nodeCode);
        item.figure = this.typeList[index].figure || '';
        item.fill = this.typeList[index].fill || '';
        item.loc = `${item.indexX} ${item.indexY}`;
        if (item.nodeCode !== 'BEGIN') {
          item.stepType = 1;
        }
        if (item.nodeCode !== 'END') {
          item.stepType = 4;
        }
        list.push(item);
      }
      return list;
    },
    // 处理连线
    setLinkDataArray (arr) {
      // {"from": "4", "to": "6", "key": "1001", "text": "小于5天 ", "remark": "", "condition": "Days<5"},
      const list = [];
      for (const i in arr) {
        const item = arr[i];
        item.text = item.tips;
        item.from = item.processNodeCode;
        item.to = item.nextProcessNodeCode;
        list.push(item);
      }
      return list;
    },

    // 获取连线节点
    getNodeData () {
      const arr = [];
      const linkList = [];
      const linkDataArray = this.nodeObj.linkDataArray;
      const nodeDataArray = this.nodeObj.nodeDataArray;
      const handleNode = this.tableData.filter(v => v.status === 0 && v.nodeName !== '开始' && v.approval !== '驳回');
      for (const i in handleNode) {
        const item = handleNode[i];
        const index = linkDataArray.findIndex(v => v.to === item.processNodeCode);
        const index2 = linkDataArray.findIndex(v => v.from === item.processNodeCode);
        if (item.status === 0) {
          arr.push(item);
        }
        if (index2 >= 0 && item.status === 0) {
          linkList.push(linkDataArray[index2]);
        }
        if (index >= 0) {
          const form = linkDataArray[index].from;
          linkList.push(linkDataArray[index]);
          const index1 = nodeDataArray.findIndex(v => v.processNodeCode === form);
          if (index1 >= 0) {
            arr.push(nodeDataArray[index1]);
          }
        }
      }
      let list = arr.filter(v => v.nodeCode !== 'BEGIN');
      const handleProcess = this.tableData.filter(v => v.status === 1);
      list = list.concat(handleProcess);
      this.linkList = [];
      for (const i in linkList) {
        const item = linkList[i];
        const index = handleProcess.findIndex(v => v.processNodeCode === item.from);
        if (index < 0) {
          this.linkList.push(item);
        }
      }
      if (handleNode.length) {
        const startIndex = nodeDataArray.findIndex(v => v.nodeCode === 'BEGIN');
        const startNode = nodeDataArray[startIndex];
        const [startLink] = linkDataArray.filter(v => v.from === startNode.processNodeCode);
        this.linkList.push(startLink);
      }
      return list;
    },
    getNodeData1 () {
      const arr = [];
      const linkList = [];
      const linkDataArray = this.nodeObj.linkDataArray;
      const nodeDataArray = this.nodeObj.nodeDataArray;
      this.approvalArr = this.tableData.filter(v => v.status === 0);
      let handleNode = [];
      if (this.flag) {
        const finishIndex = nodeDataArray.findIndex(v => v.nodeCode === 'END');
        handleNode.push(nodeDataArray[finishIndex]);
      } else {
        handleNode = this.tableData.filter(v => v.status === 1);
      }
      this.findPrevNode(handleNode);
      // 包容 并行是，一边审批通过，一边待审批
      const handleNode1 = this.tableData.filter(v => v.status === 0 && v.nodeName !== '开始' && v.approval !== '驳回');
      this.findPrevNode(handleNode1);
    },
    findPrevNode (currentNode) {
      const linkDataArray = this.nodeObj.linkDataArray;
      const nodeDataArray = this.nodeObj.nodeDataArray;
      const prevLink = [];
      const prevNode = [];
      for (let i = 0; i < currentNode.length; i++) {
        const item = currentNode[i];
        if (item.nodeCode === 'BEGIN') return;
        // 找到连线
        const prevLink = linkDataArray.filter(v => v.to === item.processNodeCode);
        for (let j = 0; j < prevLink.length; j++) {
          const child = prevLink[j];
          const from = child.from;
          const nodeIndex = nodeDataArray.findIndex(v => v.processNodeCode === from);
          if (nodeIndex >= 0) {
            const tempNode = nodeDataArray[nodeIndex];
            if (tempNode.nodeCode === 'APPROVAL' || tempNode.nodeCode === 'COUNTERSIGN') {
              if (this.approvalArr.some(v => v.processNodeCode === tempNode.processNodeCode)) {
                prevNode.push(tempNode);
                this.finishNode.push(tempNode);
                this.finishLinkNode.push(child);
              }
            } else {
              prevNode.push(tempNode);
              this.finishNode.push(tempNode);
              this.finishLinkNode.push(child);
            }
          }
        }
      }
      if (prevNode.length) {
        this.findPrevNode(prevNode);
      }
    },
    handleOpen () {
    },

    // 去掉尾巴的线
    handleLine (index) {
      if (index === this.tableData.length - 1) {
        return 'cirlineno';
      } else {
        return 'cirline';
      }
    },

    // 处理流程状态颜色
    handleStatus (row, index) {
      if (row.status === 1) {
        return 'list-status status-wait';
      } else if (row.status === 2 && row.approval === '') {
        return 'list-status status-no';
      } else {
        if (row.approval === '驳回' || row.approval === '撤回') {
          return 'list-status status-reject';
        } else {
          return 'list-status status-adopt';
        }
      }
    }
  }
};
</script>

<style scoped lang="scss">
/deep/ .el-tabs__content {
  width: 100%;
  height: calc(100% - 60px);
}
/deep/ .el-tabs {
  width: 100%;
  height: 100%;
}
.is-scrolling {
  overflow: auto;
}
.scenarioFlow {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  /deep/ .el-tabs__content {
    width: 100%;
    height: calc(100% - 60px);
    display: flex;
    align-items: center;
  }
  /deep/ .el-tab-pane {
    width: 100%;
    background: #ffffff;
  }
  /deep/ .el-tabs {
    width: 100%;
    height: 100%;
  }
  /deep/ .el-step:first-child {
    .el-step__title {
      width: 40px !important;
      height: 40px !important;
      border-radius: 50%;
      margin: 10px;
      padding: 10px !important;
      line-height: 38px;
    }
  }
  /deep/ .el-step:last-child {
    .el-step__title {
      width: 40px !important;
      height: 40px !important;
      border-radius: 50%;
      margin: 10px;
      padding: 10px !important;
      line-height: 38px;
    }
  }
  /deep/ .el-step__title.is-success {
    color: rgb(255, 255, 255);
    margin: 25px 10px 10px 10px;
    background: rgb(103, 194, 58);
    border-radius: 5px;
    padding: 5px 20px;
    display: inline-block;
    line-height: 25px;
  }
  /deep/ .el-step__title.is-process {
    color: rgb(255, 255, 255);
    margin: 25px 10px 10px 10px;
    background: #ffb001;
    border-radius: 5px;
    padding: 5px 20px;
    display: inline-block;
    line-height: 25px;
  }
  /deep/ .el-step__title.is-wait {
    color: rgb(255, 255, 255);
    margin: 25px 10px 10px 10px;
    background: rgb(192, 196, 204);
    border-radius: 5px;
    padding: 5px 20px;
    display: inline-block;
    line-height: 25px;
  }
  .process {
    height: auto !important;
  }
}
.processDefineWrap {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  /*height: 550px;*/
  .content{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
  }
  .process {
    display: flex;
    width: 100%;
    height: 500px;
    /*height: 100%;*/
    flex-direction: column;
  }
  .processCons {
    flex: auto;
    display: flex;
    padding-bottom: 30px;
    #myPaletteDiv {
      width: 160px;
      background: #f4f6f8;
      border: 1px solid #dedede;
      padding: 20px 10px;
      margin-right: 20px;
      text-align: center;
      box-sizing: border-box;
      canvas {
        padding: 40px 0;
      }
    }
    #myFlowDesignerDiv {
      flex: 1;
      border: 1px solid #dedede;
    }
  }
  .diagnosticPointInput:focus {
    border: 1px #3e75ff solid !important;
    background-color: #ff4a4a !important;
  }
  .flowLogs {
    height: 500px;
    width: 100%;
    position: relative;
    .flowLogs_fix {
      top: 0;
      width: 100%;
      position: absolute;
      bottom: 0;
      overflow-y: auto;
      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
}
.metf {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
// .metf:last-child{
//    display: none;
// }
.list-status {
  // position: absolute;
  // right: -0.8rem;
  // right: 0.2rem;
  z-index: 1000;
  position: absolute;
  right: 1.2rem;
  top: 14px;
  width: 0.8rem;
  height: 0.8rem;
  background: #ffffff;
  border-radius: 50%;
}
.cirline {
  z-index: 100;
  content: "";
  position: absolute;
  top: 103%;
  left: 47.5%;
  transform: translate(-50%, -50%);
  width: 0.5px;
  height: 29px;
  background: #9e9e9e;
  content: "";
}
.cirlineno {
  display: none;
}

.status-adopt {
  border: 2px solid rgb(79, 186, 79);
  // border: 0.4rem solid rgb(79, 186, 79);
}
.status-wait {
  border: 2px solid rgb(255, 140, 28);
  // border: 0.4rem solid rgb(255,140,28);
}
.status-reject {
  border: 2px solid #ff4a4a;
  // border: 0.4rem solid #ff4a4a;
}
.status-no {
  border: 2px solid #7f7f7f;
  // border: 0.4rem solid #7f7f7f;
}
</style>
