<!--
 * @Author: zengqin 1058574586@qq.com
 * @Date: 2022-09-29 14:55:22
 * @LastEditors: zengqin 1058574586@qq.com
 * @LastEditTime: 2023-05-05 14:08:26
 * @FilePath: \web_contract\src\components\basicComponents\sceneProcess\sendProcess.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

<template>
  <div class="sendProcess">
    <div class="cons">
      <div class="fixed-scroll">
        <el-form ref="sendProcessForm" label-position="left" :model="sendProcessForm" :rules="rules" label-width="150px"
          class="demo-ruleForm">
          <!-- 流程主题/描述 -->
          <el-form-item :label="$t('dialog.processTopic')" prop="taskName" :title="$t('dialog.processTopic')">
            <!--// 文本输入框-->
            <el-input v-model.trim="sendProcessForm.taskName" size="small" clearable maxlength="64" show-word-limit>
            </el-input>
          </el-form-item>
          <!-- 下一步办理节点 -->
          <el-form-item :label="$t('dialog.selectNextNode')" prop="processNode" :title="$t('dialog.selectNextNode')">
            <el-checkbox-group v-model="selectedProcessNode" :max="checkMax" size="small">
              <el-checkbox v-for="(column,key) in processNodeList" disabled :key="key" :label="column.processNodeCode"
                :name="column.processNodeCode">
                {{column.processNodeName}}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <template v-for="processNode in processNodeSelectedList">
            <div :key="processNode.processNodeCode">
              <el-form-item :label="processNode.processNodeName" prop="copyToUsers"
                :title="processNode.processNodeName">
                <check-choice :ref="processNode.processNodeCode" :selectConfig="assigneeUsersConfig"
                  :userList="processNode.assignees"
                  :processDisabled="processNode.canChangeAssignee === 2 ? false : true"
                  :selectAssigneeUsers.sync="processNode.assignees"
                  :isDisabled="processNode.canChangeAssignee !== 1 && processNode.canChangeAssignee !== 2"
                  @tagDelete="handleTagDelete(processNode, $event)" @select="handleApprovalUser(processNode)">
                </check-choice>
              </el-form-item>
            </div>
          </template>
          <!-- 选择提醒方式 -->
          <el-form-item :label="$t('dialog.selectAReminderMethod')" prop="reminders"
            :title="$t('dialog.selectAReminderMethod')">
            <el-checkbox-group v-model="reminders" size="small">
              <el-checkbox v-for="(column,key) in remindersList" :key="key" :label="column.id"
                :disabled="column.disabled" :name="column.id">
                <el-tooltip v-if="column.disabled" :content="column.tips" class="item" effect="dark"
                  placement="top-start">
                  <span>{{$t(column.name)}}</span>
                </el-tooltip>
                <span v-else>{{$t(column.name)}}</span>
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <!-- 我的意见 -->
          <el-form-item :label="$t('dialog.myOpinion')" prop="comment" :title="$t('dialog.myOpinion')">
            <el-input type="textarea" maxlength="512" v-model="sendProcessForm.comment"
              :autosize="{ minRows: 1, maxRows: 2}" clearable>
            </el-input>
          </el-form-item>
          <div class="commit">
            <el-tag :key="index" v-for="(item, index) in  confirmedTag" @click="Addtag(item)" size="medium">
              <span style="cursor: pointer;">
                {{item.workflowTag}}
              </span>
            </el-tag>
            <el-tag :key="item.id" v-for="item in proposalTag" closable size="medium" :disable-transitions="false"
              @close="handleClose(item)" class="customTag">
              <span @click="Addtag(item)" style="cursor: pointer;">
                {{item.workflowTag}}
              </span>
            </el-tag>
            <el-input class="input-new-tag" v-if="inputVisible" v-model.trim="inputValue" ref="saveTagInput"
              size="small" maxlength='512' @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
            </el-input>
            <el-button v-else class="button-new-tag" size="mini" @click="showInput">+</el-button>
          </div>
        </el-form>
        <!-- 选择人员 -->
        <el-dialog v-dialogDrag append-to-body :title="selectedUserTitle" center width="90%" top="5vh"
          :visible.sync="selectedUserDialog">
          <organizationUserTable v-if="selectedUserDialog" choice='isCheckbox' :isShow.sync="selectedUserDialog"
            :userList.sync="userList" :selectedUsers="selectedUsersList">
          </organizationUserTable>
        </el-dialog>
      </div>
    </div>
    <div class="footer">
      <el-button class="urgent" type="primary" icon="el-icon-circle-close" size="small"
        @click="handleProcessClose">暂不提交</el-button>
      <el-button size="small" type="primary" icon="el-icon-circle-check" @click="handleProcessSave"
        v-fast-click>确认提交</el-button>
    </div>
    <!-- 通过手机号选人 -->
    <el-dialog v-dialogDrag :title="selectedNodeInfo.handlerUserValue" :visible.sync="selectedHandlerUserDialog"
      append-to-body width="40%" top="15%">
      <getMobileUser v-if="selectedHandlerUserDialog" :closeDialog.sync="selectedHandlerUserDialog"
        @getData="getHandlerUserData">
      </getMobileUser>
    </el-dialog>
  </div>
</template>
<script>
import Auth from 'util/auth';

export default {
  data () {
    return {
      processNodeList: [], // 流程节点
      sendProcessForm: {
        businessAmount: 0,
        comment: '',
        currentProcessNodeCode: '',
        isSendSms: 0,
        processCode: '',
        projectId: 0,
        sendUsers: [],
        sid: 0,
        taskId: 0,
        taskName: '',
        stepTaskApproveNodeDtos: []
      }, // 流程提交表单
      rules: {}, // 流程表单校验
      copyToUsersConfig: {
        // 显示的列表
        tagDada: [],
        // id
        rowKey: 'assigneeId',
        // name
        rowName: 'assigneeName',
        // 默认显示的个数
        constNum: 8
      }, // 抄送人显示配置
      businessApprovalConfig: {
        // 显示的列表
        tagDada: [],
        // id
        rowKey: 'assigneeId',
        // name
        rowName: 'assigneeName',
        // 默认显示的个数
        constNum: 8
      }, // 业务审批人显示配置
      assigneeUsersConfig: {
        // 显示的列表
        tagDada: [],
        // id
        rowKey: 'assigneeId',
        // name
        rowName: 'assigneeName',
        // 默认显示的个数
        constNum: 8
      }, // 审批人显示配置
      remindersList: [
        // 短信提醒
        { id: '0', name: 'dialog.SMSReminder', disabled: false, tips: '' },
        // 邮件提醒
        { id: '1', name: 'dialog.emailReminder', disabled: false, tips: '' },
        // 语音提醒
        { id: '2', name: 'dialog.voiceReminder', disabled: false, tips: '' }
      ], // 提醒方式
      confirmedTag: [{ workflowTag: this.$t('dialog.agree'), id: 0 }, { workflowTag: this.$t('dialog.handle'), id: 1 }], // 固定意见列表
      proposalTag: [],
      inputVisible: false,
      inputValue: '',
      selectedUserTitle: '', // 选人弹出框名称
      selectedUserDialog: false,
      selectedUsersList: [], // 已选中
      userList: [],
      selectedNodeInfo: {},
      userProcesstype: '', // approval 审批人 copy 抄送人
      processNodeSelectedList: [], // 选中的节点
      selectedProcessNode: [], // 选中的节点
      reminders: [], // 提醒方式
      comment: '',
      isCanCopyTo: true, // 是否必须抄送
      isCanChangeCopy: true, // 是否允许自由抄送
      checkMax: 1000, // 可被勾选节点的最大数
      dataInfo: {}, // 业务详细数据
      amountControlRule: 0,
      loadingSubmit: null,
      selectedHandlerUserDialog: false
    };
  },
  components: {
    checkChoice (resolve) {
      require(['../global/multipleChoice/checkChoice.vue'], resolve);
    },
    // 选人
    organizationUserTable (resolve) {
      require(['components/basicComponents/userDialog/organizationUserTable'], resolve);
    },
    getMobileUser (resolve) {
      require(['./getMobileUser.vue'], resolve);
    }
  },
  props: {
    startForm: {
      type: Object,
      default: () => { }
    },
    processSubmitApi: {
      type: Object,
      default: () => { }
    }
  },
  created () {
    const dataInfo = localStorage.getItem('dataInfo');
    this.dataInfo = dataInfo ? JSON.parse(dataInfo) : {};
    this.getProcessStartNode();
    this.getTag();
  },
  watch: {
    userList: {
      handler () {
        if (this.userProcesstype === 'copy') {
          if (this.userList.length === 0) {
            this.copyToUsersConfig.tagDada = [];
          } else if (this.copyToUsersConfig.tagDada.length === 0) {
            for (const as of this.userList) {
              as.isChecked = true;
            }
            this.copyToUsersConfig.tagDada = this.userList;
          } else {
            for (const item of this.userList) {
              item.isChecked = true;
            }
            this.copyToUsersConfig.tagDada = this.userList;
          }
        } else {
          this.processNodeSelectedList.forEach(item => {
            if (this.userProcesstype === item.processNodeCode) {
              // ---------------------
              let assignees = this.$clone(item.assignees);
              if (this.userList.length === 0) {
                item.assignees = [];
              } else if (assignees.length === 0) {
                assignees = this.userList;
                for (const as of assignees) {
                  as.isChecked = true;
                }
                item.assignees = assignees;
              } else {
                for (const item of this.userList) {
                  item.isChecked = true;
                }
                item.assignees = this.userList;
              }
              // ---------------------
            }
          });
        }
      },
      deep: true
    }
  },
  methods: {
    // canCopyTo 是否必须抄送 0 是 1 否
    // canChangeCopy 是否允许自由抄送  0 是 1 否
    // 获取开始节点信息
    getProcessStartNode () {
      const results = this.$clone(this.startForm);
      results.comment = '';
      const taskName = results.stepNextNodesDto.taskName;
      let docNo = '';
      const docNoCode = this.processSubmitApi.dataCode || 'docNo';
      docNo = this.dataInfo && this.dataInfo[docNoCode] ? `-${this.dataInfo[docNoCode]}` : '';
      this.sendProcessForm = results;
      this.sendProcessForm.taskName = `${taskName}${docNo}`;
      this.processNodeList = results.stepNextNodesDto.nextNodes;
      this.selectedProcessNode = [this.processNodeList[0].processNodeCode];
      this.processNodeSelectedList = this.processNodeList;
      // 设置提醒方式
      this.reminders = [];
      this.setReminders();
    },
    // 设置提醒方式
    setReminders () {
      if (this.processNodeList.some(v => v.isSendSms === 1)) {
        this.reminders.push('0');
      }
      if (this.processNodeList.some(v => v.isSendEmail === 1)) {
        this.reminders.push('1');
      }
      if (this.processNodeList.some(v => v.isSendVoice === 1)) {
        this.reminders.push('2');
      }
    },
    getTag () {
      this.$store.dispatch('processApi/tagList').then(res => {
        if (!res.results) return;
        this.proposalTag = res.results;
      });
    },
    // 标签函数
    handleClose (tag) {
      this.$store.dispatch('processApi/tagDelete', { tagId: tag.id }).then(res => {
        this.getTag();
      });
    },
    showInput () {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm () {
      if (!this.inputValue) {
        this.inputVisible = false;
        this.inputValue = '';
        return;
      }
      const inputValue = this.inputValue;
      const data = {
        workflowTag: inputValue
      };
      this.$store.dispatch('processApi/tagCreate', data).then(res => {
        this.getTag();
        this.inputVisible = false;
        this.inputValue = '';
      });
    },
    Addtag (val) {
      this.comment = val.workflowTag;
      this.sendProcessForm.comment = this.comment;
    },
    // 点击选择审批人
    handleApprovalUser (processNode) {
      this.selectedNodeInfo = processNode;
      this.userProcesstype = processNode.processNodeCode;
      this.selectedUserTitle = this.$t('dialog.selectReviewer');
      if (processNode.handlerUserCode === '03') {
        this.selectedHandlerUserDialog = true;
      } else {
        this.selectedUserDialog = true;
      }
    },
    // 获取手机号的用户
    getHandlerUserData (val) {
      this.processNodeSelectedList[0].assignees = [val];
      this.selectedHandlerUserDialog = false;
    },
    // 删除审批人
    handleTagDelete (processNode, row) {
      this.processNodeSelectedList.forEach(item => {
        if (processNode.processNodeCode === item.processNodeCode) {
          const index = item.assignees.findIndex(v => v.assigneeId === row.assigneeId);
          if (index >= 0) {
            item.assignees.splice(index, 1);
          }
        }
      });
    },
    // 暂不提交
    handleProcessClose (status = false) {
      this.$emit('closeDialog', status);
    },
    // 确认提交 校验
    handleProcessSave () {
      this.$refs.sendProcessForm.validate((valid) => {
        if (valid) {
          this.setProcessData();
        }
      });
    },
    // 组合数据
    setProcessData () {
      const processNodeSelectedList = [];
      this.processNodeSelectedList.forEach(item => {
        const index = this.selectedProcessNode.findIndex(v => v === item.processNodeCode);
        if (index >= 0) {
          processNodeSelectedList.push(item);
        }
      });
      for (const item of processNodeSelectedList) {
        if (!item.assignees || item.assignees.length === 0) {
          this.$message.error(this.$t('dialog.youMustSelectOne'));
          return;
        }
        const assignees = item.assignees.filter(v => v.isChecked);
        // 所选节点中审批人必选一个
        if (assignees.length === 0) {
          this.$message.error(this.$t('dialog.youMustSelectOne'));
          return;
        }
      }
      this.loadingSubmit = this.$loading({
        lock: true,
        background: 'rgba(0,0,0,0.7)',
        spinner: 'el-icon-loading'
      });
      const isSendSms = this.reminders.findIndex(v => v === '0') >= 0 ? 1 : 0;
      const isSendEmail = this.reminders.findIndex(v => v === '1') >= 0 ? 1 : 0;
      const isSendVoice = this.reminders.findIndex(v => v === '2') >= 0 ? 1 : 0;
      const data = {
        comment: this.sendProcessForm.comment,
        createBy: Auth.hasUserInfo().userId,
        createByEmail: Auth.hasUserInfo().email,
        createByMobile: Auth.hasUserInfo().mobile,
        createByName: Auth.hasUserInfo().userName,
        currentProcessNodeCode: this.sendProcessForm.stepNextNodesDto.currentProcessNodeCode,
        formCode: this.sendProcessForm.formCode,
        isSendEmail,
        isSendSms,
        isSendVoice,
        launchName: Auth.hasUserInfo().supplierName,
        processCode: this.sendProcessForm.stepNextNodesDto.processCode,
        sid: this.sendProcessForm.sid,
        signature: Auth.hasUserInfo().signPic,
        stepTaskApproveNodeDtos: this.processNodeList,
        taskId: this.sendProcessForm.taskId,
        taskName: this.sendProcessForm.taskName,
        tenantId: this.dataInfo.tenantId
      };
      this.handleProcessSubmit(data);
    },
    // 流程提交
    handleProcessSubmit (data) {
      this.$store.dispatch(this.processSubmitApi.startSubmit.url, data).then(res => {
        if (res.status === 0) {
          this.handleProcessClose(true);
          this.$message.success(this.$t('tips.processSuccess'));
        } else {
          this.$message.error(this.$t(`exception.${res.errorCode}`));
        }
        this.loadingSubmit.close();
      }).catch(e => {
        this.loadingSubmit.close();
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.sendProcess {
  min-height: 500px;
  max-height: 550px;
  position: relative;
  padding: 20px;
  display: flex;
  flex-direction: column;
  .cons {
    position: relative;
    flex: 1;
  }
}
.commit {
  padding-left: 120px;
  box-sizing: border-box;
  margin-bottom: 20px;
  width: 100%;
  .el-tag {
    margin-right: 10px;
    margin-bottom: 10px;
    max-width: 100%;
  }
  .customTag {
    span {
      display: inline-block;
      max-width: 95%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      vertical-align: top;
    }
  }
  .input-new-tag {
    margin-top: 10px;
  }
}
</style>
