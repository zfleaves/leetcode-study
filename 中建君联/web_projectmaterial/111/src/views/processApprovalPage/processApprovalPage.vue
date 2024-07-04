<!--
 * @Author: your name
 * @Date: 2020-07-16 17:31:30
 * @LastEditTime: 2022-08-23 14:54:17
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_unit\src\views\processApprovalPage\processApprovalPage.vue
-->
<template>
  <div class="processApprovalPage">
    <div class="processApproval">
      <!-- 流程按钮 -->
      <g-edit-title :title="`${$t(`button.${parmasData.type}`)}`">
        <div v-if="isGetData">
          <el-button type="primary" icon="iconfont icon-submit" size="small" v-fast-click :disabled="processButStatus"
            @click="nextStep">{{$t('button.submitNext')}}
          </el-button>
          <!-- 快速同意 -->
          <el-button type="primary" class="other" icon="el-icon-check" size="small" v-fast-click
            :disabled="processButStatus" @click="quickConsent">{{$t('button.quickConsent')}}
          </el-button>
          <el-button type="primary" class="urgent" icon="el-icon-arrow-left" size="small" v-fast-click
            :disabled="processButStatus" @click="TakeStepBack" v-if="isBeginNodeCode">{{$t('button.backStep')}}
          </el-button>
          <!-- 委托 -->
          <el-button type="primary" class="other" icon="el-icon-upload2" size="small" v-fast-click
            :disabled="processButStatus" @click="handleEntrust">{{$t('button.entrust')}}
          </el-button>
          <el-button type="primary" class="other" icon="el-icon-d-arrow-left" size="small" v-fast-click
            :disabled="processButStatus" @click="Returnsponsor" v-if="isBeginNodeCode">{{$t('button.returnToSponsor')}}
          </el-button>
          <el-button type="primary" class="more" icon="el-icon-third-Monitor" size="small" v-fast-click
            :disabled="processButStatus" @click="handleMonitor">{{$t('button.monitorProcess')}}
          </el-button>
          <el-button type="primary" class="urgent" icon="el-icon-third-deleteMore" size="small" v-fast-click
            :disabled="processButStatus" @click="handleDeleteProcess" v-if="!isBeginNodeCode">
            {{$t('button.deleteProcess')}}
          </el-button>
        </div>
      </g-edit-title>
      <component style="flex:1;" ref="processEdit" :is="parmasData.processPageName"
        :judegMultitonColumns="judegMultitonColumns" :pageNode.sync='pageNode' @processSubmit="processSubmit">
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
    <!-- 请选择用户 -->
    <g-dialog v-if="userEntrustFlag" :dialogConfig="userEntrustDialogConfig" :isVisible.sync="userEntrustFlag">
      <organizationUserTable slot="body" slot-scope="{height}" :dialogHeight="height" choice="isRadio"
        :close.sync="userEntrustFlag" @selectUser="getEntrustUser" v-if="userEntrustFlag"></organizationUserTable>
    </g-dialog>
  </div>
</template>
<script>
import { process } from 'mixins/processMixins';

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
    this.parmasData.taskDetailId = Number(this.$base64.decode(this.$route.params.taskDetailId));
    this.parmasData.processPageName = this.$route.params.translateName;
    this.processParmas = this.$clone(this.parmasData);
    // 获取任务消息
    this._getWorkflowTaskDetailInfo();
  },
  computed: {
    pageNode () {
      return this.nodeCode;
    }
  },
  components: {
    // 提交流程
    nextProcess (resolve) {
      require(['components/basicComponents/process/nextProcess'], resolve);
    },
    // 无流程时提交弹出框
    noProcess (resolve) {
      require(['components/basicComponents/process/noProcess.vue'], resolve);
    },
    // 需求总计划
    masterPlan (resolve) {
      require(['views/demandPlan/masterPlan/masterPlanEdit.vue'], resolve);
    },
    // 调整
    masterPlanAdjust (resolve) {
      require(['views/demandPlan/masterPlanAdjust/masterPlanAdjustEdit.vue'], resolve);
    },
    // 年
    yearPlan (resolve) {
      require(['views/demandPlan/yearPlan/yearPlanEdit.vue'], resolve);
    },
    // 季
    quarterPlan (resolve) {
      require(['views/demandPlan/quarterPlan/quarterPlanEdit.vue'], resolve);
    },
    // 月
    monthPlan (resolve) {
      require(['views/demandPlan/monthPlan/monthPlanEdit.vue'], resolve);
    },
    // 临时
    tempPlan (resolve) {
      require(['views/demandPlan/tempPlan/tempPlanEdit.vue'], resolve);
    },
    // 周
    weekPlan (resolve) {
      require(['views/demandPlan/weekPlan/weekPlanEdit.vue'], resolve);
    },
    // 采购计划
    promaterialPurchaseApply (resolve) {
      require(['views/promaterial/promaterialPurchaseApply/promaterialPurchaseApplyEdit.vue'], resolve);
    },
    // 供货订单
    supplyOrder (resolve) {
      require(['views/promaterial/supplyOrder/supplyOrderEdit.vue'], resolve);
    },
    // 甲供供货订单
    supplyOrderA (resolve) {
      require(['views/promaterial/supplyOrderA/supplyOrderAEdit.vue'], resolve);
    },
    // 到货验收
    checkArrival (resolve) {
      require(['views/promaterial/checkArrival/checkArrivalEdit.vue'], resolve);
    },
    // 零星采购
    sporadicPurchase (resolve) {
      require(['views/promaterial/sporadicPurchase/sporadicPurchaseEdit.vue'], resolve);
    },
    // 合同结算
    purchaseSettlement (resolve) {
      require(['views/promaterial/purchaseSettlement/purchaseSettlementEdit.vue'], resolve);
    },
    // 付款申请
    paymentApply (resolve) {
      require(['views/promaterial/paymentApply/paymentApplyEdit.vue'], resolve);
    },
    // 零星采购报销
    sporadicReimburse (resolve) {
      require(['views/promaterial/sporadicReimburse/sporadicReimburseEdit.vue'], resolve);
    },
    // ----------- 出入库管理 ---------------------
    // 材料入库
    warIncoming (resolve) {
      require(['views/warManagement/warIncoming/warIncomingEdit.vue'], resolve);
    },
    // 材料出库
    warOutbound (resolve) {
      require(['views/warManagement/warOutbound/warOutboundEdit.vue'], resolve);
    },
    // 领料退回
    warReturn (resolve) {
      require(['views/warManagement/warReturn/warReturnEdit.vue'], resolve);
    },
    // 材料报损
    warReportloss (resolve) {
      require(['views/warManagement/warReportloss/warReportlossEdit.vue'], resolve);
    },
    // 材料退货
    warReturngoods (resolve) {
      require(['views/warManagement/warReturngoods/warReturngoodsEdit.vue'], resolve);
    },
    // 材料调拨
    warAllocation (resolve) {
      require(['views/warManagement/warAllocation/warAllocationEdit.vue'], resolve);
    },
    // 盘点
    warInventory (resolve) {
      require(['views/warManagement/warInventory/warInventoryEdit.vue'], resolve);
    },
    // 废旧物资处理
    wasteMaterials (resolve) {
      require(['views/warManagement/wasteMaterials/wasteMaterialsEdit.vue'], resolve);
    },
    // ----------- 工程设备管理 ---------------------
    // 工程设备安装
    equipInstall (resolve) {
      require(['views/equip/equipInstall/equipInstallEdit.vue'], resolve);
    },
    // 工程设备检测
    equipCheck (resolve) {
      require(['views/equip/equipCheck/equipCheckEdit.vue'], resolve);
    },
    // ----------- 分包方材料管理 ---------------------
    // 材料进场
    materialApproach (resolve) {
      require(['views/subcontractorMaterial/materialApproach/materialApproachEdit.vue'], resolve);
    },
    // 材料退场
    materialsBothered (resolve) {
      require(['views/subcontractorMaterial/materialsBothered/materialsBotheredEdit.vue'], resolve);
    }
  },
  methods: {
    // 提交流程
    // 查询单个节点的任务信息 taskDetailId
    _getWorkflowTaskDetailInfo () {
      this.$store.dispatch('processApi/workflowTaskDetailInfo', { taskDetailId: this.parmasData.taskDetailId }).then(res => {
        this.processTaskInfo = res.results;
        this.processParmas.id = res.results.taskSid;
        this.nodeCode = this.processTaskInfo.nodeCode;
        this.$refs.processEdit.nodeCode = this.nodeCode;
        if (this.nodeCode === 'BEGIN') {
          this.pageConfigEdit = this.$refs.processEdit.page.PageConfig;
          this.$refs.processEdit._getInfoData(this.processTaskInfo.taskSid);
          this.isBeginNodeCode = false;
          if (this.processButStatus) {
            this.$refs.processEdit.pageDisabled = false;
          } else {
            this.$refs.processEdit.pageDisabled = true;
          }
          return;
        }
        this.$refs.processEdit.setPageDisabed && this.$refs.processEdit.setPageDisabed();
        this._getWorkflowFormColumns();
      });
    },
    // 查询表单状态
    _getWorkflowFormColumns () {
      const params = {
        formStatusCode: this.processTaskInfo.formStatusCode || 'DISDLED',
        isDisable: 0
      };
      this.$store.dispatch('processApi/workflowFormColumns', params).then(res => {
        this.workflowFormColumnsList = res.results;
        this.judegMultitonColumns();
        this.$refs.processEdit._getInfoData(this.processTaskInfo.taskSid);
      });
    },
    //  判断下面表格 是否禁选
    // judegMultitonColumns () {
    //   this.pageConfigEdit = this.$refs.processEdit.page.PageConfig;
    //   // 主表 mainFormConfig
    //   const mainFormConfig = this.pageConfigEdit.mainFormConfig.formList;
    //   // 子表 subTableConfig
    //   const subTableConfig = this.pageConfigEdit.subTableConfig;
    //   // 主表状态 singletonColumns
    //   const singletonColumns = this.workflowFormColumnsList ? this.workflowFormColumnsList.singletonColumns : [];
    //   // 子表状态 multitonColumns
    //   const multitonColumns = this.workflowFormColumnsList ? this.workflowFormColumnsList.multitonColumns : [];
    //   // 主表状态变更
    //   for (const item of mainFormConfig) {
    //     const val = singletonColumns.find(val => (item.relationProp ? item.relationProp : item.prop) === val.columnCode);
    //     if (val) {
    //       if (item.inputStatus === 'disable' && val.columnStatusCollectCode === 'hide') {
    //         this.$set(item, 'inputStatus', 'hide');
    //       } else if (item.inputStatus === 'disable' && item.processStatus) {
    //         item.inputStatus = val.columnStatusCollectCode.toLowerCase();
    //       } else if (item.inputStatus === 'disable' && !item.processStatus) {
    //         item.inputStatus = 'disable';
    //       } else {
    //         item.inputStatus = val.columnStatusCollectCode.toLowerCase();
    //       }
    //       if (item.prop === 'areas') {
    //         item.inputStatus = val.columnStatusCollectCode.toLowerCase();
    //       }
    //     } else {
    //       if (item.inputStatus === 'hide') {
    //         item.inputStatus = 'hide';
    //       } else {
    //         item.inputStatus = 'disable';
    //       }
    //     }
    //   }
    //   // 子表状态变更
    //   for (const i in multitonColumns) {
    //     const item = multitonColumns[i];
    //     for (const val in subTableConfig) {
    //       const subTable = subTableConfig[val];
    //       if (item.multitonCode === val) {
    //         for (const sub of subTable.tableList.slaveColumns) {
    //           if (item.multitonColumns.some(v => v.columnStatusCollectCode === 'DISABLE')) {
    //             subTable.subTableButton && subTable.subTableButton.forEach(item => item.disabled = true);
    //             subTable.isNaNTableMust = false;
    //           } else {
    //             if (subTable.isRelationTable && this.nodeCode !== 'BEGIN') {
    //               subTable.subTableButton && subTable.subTableButton.forEach(item => item.disabled = false);
    //               subTable.isNaNTableMust = true;
    //             }
    //           }
    //           const multiton = item.multitonColumns.find(multiton => sub.prop === multiton.columnCode);
    //           if (multiton) {
    //             if (sub.inputStatus === 'disable' && multiton.columnStatusCollectCode === 'HIDE') {
    //               sub.inputStatus = 'hide';
    //             } else if (sub.inputStatus === 'disable' && sub.processStatus) {
    //               sub.inputStatus = multiton.columnStatusCollectCode.toLowerCase();
    //             } else if (sub.inputStatus === 'disable' && !sub.processStatus) {
    //               sub.inputStatus = 'disable';
    //             } else if (sub.inputStatus === 'disable' && sub.processStatus === 'true') {
    //               sub.inputStatus = 'edit';
    //             } else if (sub.inputStatus === 'hide') {
    //               sub.inputStatus = 'hide';
    //             } else {
    //               sub.inputStatus = multiton.columnStatusCollectCode.toLowerCase();
    //             }
    //             if (sub.prop === 'areas') {
    //               sub.inputStatus = multiton.columnStatusCollectCode.toLowerCase();
    //             }
    //           } else {
    //             if (sub.inputStatus === 'hide') {
    //               sub.inputStatus = 'hide';
    //             } else {
    //               sub.inputStatus = 'disable';
    //             }
    //           }
    //         }
    //       }
    //     }
    //   }
    //   this.$refs.processEdit.pageConfig = this.pageConfigEdit;
    //   this.$refs.processEdit.pageConfigLoading = true;
    // },
    // 提交
    // nextStep () {
    //   this.processType = 'next';
    //   this.$refs.processEdit.handleSave(true);
    // },
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
          nextParmas[item.receive] = this.processTaskInfo[item.value] || this.pageConfigEdit.projectForm[item.value];
        }
      } else {
        nextParmas[nextInfo.parmas] = this.processTaskInfo.taskSid;
      }
      const processParmas = {
        processNodeCode: this.processTaskInfo.processNodeCode,
        taskId: this.processTaskInfo.taskId
      };
      const data = Object.assign(nextParmas, processParmas);
      this.$store.dispatch(nextInfo.url, data).then(res => {
        this.nextProcessForm = res.results;
        if (this.nextProcessForm.workflowNextNodes === null) {
          this.processName = 'noProcess';
        } else {
          this.processName = 'nextProcess';
        }
        this.dialogProcess = true;
      });
    },
    // 流程监控
    handleMonitor () {
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
              this.$store.dispatch(deleteParams.url, { [deleteParams.params]: this.processTaskInfo.taskSid }).then(res => {
                if (res.status === 0) {
                  this.$message.success(`${this.$t('button.deleteProcess')}${this.$t('tips.success')}`);
                  this.submitPorcess();
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
    submitNextProcess ({ url, data }) {
      // 提交时保存
      const pageData = this.$refs.processEdit.pageData;
      this.$refs.processEdit.saveData(pageData, true, () => {
        this.handleSubmitNext(url, data);
      });
    },
    // 提交下一步
    handleSubmitNext (url, data) {
      this.$store.dispatch(url, data).then(res => {
        if (res.status === 0) {
          this.$message.success(this.$t('tips.nextProcess'));
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
      const url = `${this.$utils.config.jumpUrl}/portal/#/task`;
      window.open(url, '_self');
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

