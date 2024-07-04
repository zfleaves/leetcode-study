<!--
 * @Author: your name
 * @Date: 2020-07-16 17:31:30
 * @LastEditTime: 2022-10-27 15:52:32
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_unit\src\views\processApprovalPage\processApprovalPage.vue
-->
<template>
  <div class="processApprovalPage">
    <div class="processApproval">
      <!-- 流程按钮 -->
      <!-- :title="`${$t(`menu.${parmasData.processPageName}`)}`" -->
      <g-edit-title :title="`${$t(`button.${parmasData.type}`)}`">
        <div v-if="isGetData">
          <el-button type="primary" icon="iconfont icon-submit" size="small" v-fast-click :disabled="processButStatus"
            @click="nextStep">{{$t('button.submitNext')}}
          </el-button>
          <el-button type="primary" class="other" icon="el-icon-d-arrow-left" size="small" v-fast-click
            :disabled="processButStatus" @click="Returnsponsor" v-if="isBeginNodeCode">{{$t('button.returnToSponsor')}}
          </el-button>
          <el-button type="primary" class="more" icon="el-icon-third-Monitor" size="small" v-fast-click
            :disabled="processButStatus" @click="handleMonitor">{{$t('button.stepMonitorProcess')}}
          </el-button>
          <el-button type="primary" class="urgent" icon="el-icon-third-deleteMore" size="small" v-fast-click
            :disabled="processButStatus" @click="handleDeleteProcess" v-if="!isBeginNodeCode">
            {{$t('button.deleteProcess')}}
          </el-button>
        </div>
      </g-edit-title>
      <component style="flex:1;" ref="processEdit" :is="parmasData.processPageName" @processSubmit="processSubmit">
      </component>
    </div>
    <!-- 流程审批弹出框 -->
    <el-dialog :title="`${$t(`menu.${parmasData.processPageName}`)} ${$t('tips.processSubmission')}`"
      v-if="dialogProcess" :top="processName==='nextProcess'?'10vh':'25vh'"
      :width="processName==='nextProcess'?'600px':'400px'" center :visible.sync="dialogProcess">
      <component @closeDialog="handleCloseDialog" @submitPorcess='submitPorcess' @nextProcess='submitNextProcess'
        :is="processName" :nextForm="nextProcessForm" :processSubmitApi="pageConfigEdit.processParmas"
        :processType="processType">
      </component>
    </el-dialog>
  </div>
</template>
<script>
import {process} from 'mixins/sceneProcessMixins';

export default {
  mixins: [process],
  data () {
    return {
      isGetData: true,
      isBeginNodeCode: true, // 是否为开始节点
      processTaskInfo: {},
      processParmas: {},
      pageConfigEdit: {},
      nodeCode: '',
      dialogProcess: false,
      processName: 'nextProcess',
      nextProcessForm: {},
      processType: 'next',
      parmasData: {},
      processPageName: '',
      processButStatus: false
    };
  },
  created () {
    this.parmasData.type = this.$base64.decode(this.$route.params.type);
    if (this.parmasData.type === 'undo') {
      this.processButStatus = false;
    } else {
      this.processButStatus = true;
    }
    console.log(this.parmasData.type, 'this.parmasData.type');
    this.parmasData.taskDetailId = Number(this.$base64.decode(this.$route.params.taskDetailId));
    this.parmasData.processPageName = this.$route.params.translateName;
    this.processParmas = this.$clone(this.parmasData);
    // 获取任务消息
    this._getWorkflowTaskDetailInfo();
  },
  components: {
    // 提交流程
    nextProcess (resolve) {
      require(['components/basicComponents/sceneProcess/nextProcess'], resolve);
    },
    // 无流程时提交弹出框
    noProcess (resolve) {
      require(['components/basicComponents/sceneProcess/noProcess.vue'], resolve);
    },
    // 结算申报
    purchaseSettlement (resolve) {
      require(['views/promaterial/supplierSettlementDeclaration/supplierSettlementDeclarationEdit'], resolve);
    },
    // 付款申请
    paymentApply (resolve) {
      require(['views/promaterial/materialPaymentSupplier/materialPaymentSupplierEdit'], resolve);
    }
  },
  methods: {
    // 查询单个节点的任务信息
    _getWorkflowTaskDetailInfo () {
      this.$store.dispatch('publicApi/getStepTaskInfoPublicApi', { taskDetailId: this.parmasData.taskDetailId }).then(res => {
        this.processTaskInfo = res.results;
        this.processParmas.id = res.results.sid;
        this.nodeCode = this.processTaskInfo.nodeType;
        this.$refs.processEdit.nodeCode = this.nodeCode;
        if (this.nodeCode === 'BEGIN') {
          this.pageConfigEdit = this.$refs.processEdit.page.PageConfig;
          this.$refs.processEdit._getInfoData(this.processTaskInfo.sid);
          this.isBeginNodeCode = false;
          return;
        }
        this._getWorkflowFormColumns();
      });
    },
    // 查询表单状态
    _getWorkflowFormColumns () {
      this.$refs.processEdit._getInfoData(this.processTaskInfo.sid, this.judegMultitonColumns());
      this.judegMultitonColumns();
    },
    //  判断下面表格 是否禁选
    judegMultitonColumns() {
        this.pageConfigEdit = this.$refs.processEdit.page.PageConfig;
        // 主表
        const mainFormConfig = this.pageConfigEdit.mainFormConfig.formList;
        // 子表
        const subTableConfig = this.pageConfigEdit.subTableConfig;
        // 主表状态变更
        for (const item of mainFormConfig) {
            if (item.inputStatus === 'hide') {
                item.inputStatus = 'hide';
            } else {
                item.inputStatus = 'disable';
            }
        }
        // 子表状态变更
        for (const val in subTableConfig) {
                const subTable = subTableConfig[val];
                subTable.subTableButton && subTable.subTableButton.forEach(item => item.disabled = true);
                subTable.isNaNTableMust = false;
                for (const sub of subTable.tableList.slaveColumns) {
                        if (sub.inputStatus === 'disable' && !sub.processStatus) {
                            sub.inputStatus = 'disable';
                        } else if (sub.inputStatus === 'disable' && sub.processStatus === 'true') {
                            sub.inputStatus = 'edit';
                        } else if (sub.inputStatus === 'hide') {
                            sub.inputStatus = 'hide';
                        } else {
                            sub.inputStatus = 'disable';
                        }
                }
            }
        this.$refs.processEdit.pageConfig = this.pageConfigEdit;
        this.$refs.processEdit.pageConfigLoading = true;
    },
    // 退回上一步
    TakeStepBack () {
      this.processType = 'returnPrev';
      this._getProcessNodeInfo();
    },
    // 退回发起人
    Returnsponsor () {
      this.processType = 'returnStart';
      this._getProcessNodeInfo();
    },
    // 获取流程节点信息
    _getProcessNodeInfo () {
      const nextInfo = this.pageConfigEdit.processParmas.nextInfo;
      const nextParmas = {};
      if (nextInfo.parmasList && nextInfo.parmasList.length) {
        for (const item of nextInfo.parmasList) {
          nextParmas[item.receive] = (this.processTaskInfo[item.value] || this.pageConfigEdit.projectForm[item.value]) || '';
        }
      } else {
        nextParmas[nextInfo.parmas] = this.processTaskInfo.sid;
      }
      const processParmas = {
        processNodeCode: this.processTaskInfo.processNodeCode,
        taskId: this.processTaskInfo.taskId
      };
      const data = Object.assign(nextParmas, processParmas);
      data.formCode = this.pageConfigEdit.formCode;
      this.$store.dispatch(nextInfo.url, data).then(res => {
        this.nextProcessForm = res.results;
        if (this.nextProcessForm.stepNextNodesDto === null) {
            this.processName = 'noProcess';
            this.dialogProcess = true;
        } else {
            if (this.processType === 'next' && this.nextProcessForm.stepNextNodesDto.nextNodes[0].handlerUserCode === '04') {
                const customJson = this.processTaskInfo.customJson;
                this[customJson] && this[customJson]();
            } else {
                this.processName = 'nextProcess';
                this.dialogProcess = true;
            }
        }
      });
    },
    // 退回建采之家
    getSupplierUserInfoProcessSubmit() {
        // 数据将推送至供方进行开票上传影像资料，是否提交？
        this.$confirm(this.$t('tips.getSupplierUserInfoProcessSubmitTips'),
        `${this.$t(`menu.${this.$route.params.translateName}`)}${this.$t('button.submitNext')}`, {
            dangerouslyUseHTMLString: true,
            confirmButtonText: this.$t('button.determine'),
            cancelButtonText: this.$t('button.close'),
            type: 'warning'
        }).then(() => {
            this.$store.dispatch('publicApi/getSupplierUserInfoPublicApi', {userId: this.pageConfigEdit.projectForm.createBy}).then(res => {
                if (res.status === 0 && res.results) {
                    this.stepTaskApproveNodeDtos = [
                        {
                            processNodeCode: this.nextProcessForm.stepNextNodesDto.nextNodes[0].processNodeCode,
                            assignees: [
                                {
                                    assigneeEmail: res.results.email,
                                    assigneeId: res.results.id,
                                    assigneeMobile: res.results.mobile,
                                    assigneeName: res.results.userName
                                }
                            ]
                        }
                    ];
                    this.nextProcess();
                } else {
                    // 未找到用户，不能提交！
                    this.$message.error(this.$t('tips.getUserInfoErrorTips'));
                }
            });
        }).catch(() => {
        });
    },
    // 流程监控
    handleMonitor () {
        localStorage.setItem('processType', 'scenarioFlow');
        this.$store.commit('diaLog/set_process_dialog', this.processTaskInfo.taskId);
    },
    // 删除流程
    handleDeleteProcess () {
      // 你确定要删除本流程吗？删除后不可恢复!
      // 与本流程绑定的业务数据也将同步删除且不可恢复!
      const message = `<span style="color: red;">${this.$t('tips.wantDeleteProcess')}<br>${this.$t('tips.deleteProcessTips')}</span>`;
      this.$confirm(message, this.$t('button.deleteProcess'),
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: this.$t('button.determine'),
          cancelButtonText: this.$t('button.close')
        }).then(() => {
          this.$store.dispatch('processApi/workflowProcessDelete', { taskId: this.processTaskInfo.taskId }).then(res => {
            if (res.status === 0) {
              const deleteParams = this.pageConfigEdit.processParmas.deleteParams;
              this.$store.dispatch(deleteParams.url, { [deleteParams.params]: this.processTaskInfo.sid }).then(res => {
                if (res.status === 0) {
                  this.$message.success(`${this.$t('button.deleteProcess')}${this.$t('tips.success')}`);
                  this.$refs.processEdit && this.$refs.processEdit.setRoute();
                } else {
                  this.$message.error(this.$t(`exception.${res.errorCode}`));
                }
              });
            } else {
              this.$message.error(this.$t(`exception.${res.errorCode}`));
            }
          });
        });
    },
    // 关闭 流程审批弹出框
    handleCloseDialog (status) {
      this.dialogProcess = false;
    },
    // 提交下一步弹窗
    submitNextProcess ({ url, data, nodeType }) {
      // 提交时保存
      const pageData = this.$refs.processEdit.pageData;
      this.$refs.processEdit.saveData(pageData, true, () => {
        this.handleSubmitNext(url, data, nodeType);
      });
    },
    // 提交下一步
    handleSubmitNext (url, data, nodeType) {
      this.$store.dispatch(url, data).then(res => {
        if (res.status === 0) {
          // 已完成信息写入，您现在应尽快提交此单据的内部审批流程。
          const nextProcessTips = nodeType === 'END' ? this.$t('tips.nextEndProcess') : this.$t('tips.nextProcess');
          this.$message.success(nextProcessTips);
          this.submitPorcess();
        } else {
          this.$message.error(this.$t(`exception.${res.errorCode}`));
        }
      });
    },
    // 提交流程后 关闭页面
    submitPorcess () {
      // this.$refs.processEdit.setRoute();
      this.handleReturnTask();
    },
    // 返回流程任务页面
    handleReturnTask () {
      // window.location.href = `${this.$utils.config.jumpUrl}/portal/#/task`;
      // window.close();
      const toPage = {
        materialSettlementDeclaration: 'purchaseSettlement',
        materialPaymentSupplier: 'paymentApply'
      };
      if (toPage[this.processTaskInfo.formCode]) {
        this.$refs.processEdit && this.$refs.processEdit.closePage(() => {
          this.$router.push(`/${toPage[this.processTaskInfo.formCode]}`);
        });
      } else {
        this.$refs.processEdit && this.$refs.processEdit.setRoute();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.processApprovalPage {
  width: 100%;
  height: 100%;
  .processApproval {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
}
</style>
