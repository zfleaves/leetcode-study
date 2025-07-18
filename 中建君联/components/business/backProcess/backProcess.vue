<!--
 * @Author: zengqin 1058574586@qq.com
 * @Date: 2022-12-30 11:15:00
 * @LastEditors: zengqin 1058574586@qq.com
 * @LastEditTime: 2023-05-05 09:13:13
 * @FilePath: \web_portal\src\components\business\backProcess\backProcess.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Author: your name
 * @Date: 2020-12-02 10:02:44
 * @LastEditTime: 2020-12-02 10:57:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_portal\src\components\business\nextProcess\nextProcess.vue
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
            <el-input v-model.trim="sendProcessForm.taskName" size="small" disabled maxlength="64" show-word-limit>
            </el-input>
          </el-form-item>
          <!-- 选择抄送人 -->
          <el-form-item :label="$t('dialog.selectCc')" prop="copyToUsers" :title="$t('dialog.selectCc')">
            <multipleChoice :selectConfig="copyToUsersConfig" :processDisabled="true" :isDisabled="isCanChangeCopy"
              @tagDelete="handleCopyToUsersDelete" @select="handleCopyToUsers"></multipleChoice>
          </el-form-item>
          <!-- 选择提醒方式 -->
          <el-form-item :label="$t('dialog.selectAReminderMethod')" prop="reminders"
            :title="$t('dialog.selectAReminderMethod')">
            <el-checkbox-group v-model="reminders" size="small">
              <el-checkbox v-for="(column,key) in remindersList" :key="key" :label="column.id" :name="column.id">
                {{$t(column.name)}}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <!-- 我的意见 -->
          <el-form-item :label="$t('dialog.myOpinion')" prop="comment" :title="$t('dialog.myOpinion')">
            <el-input maxlength="100" size="small" v-model="sendProcessForm.comment" clearable>
            </el-input>
          </el-form-item>
          <div class="commit">
            <el-tag :key="index" v-for="(item, index) in  confirmedTag" @click="Addtag(item)" size="medium">
              <span style="cursor: pointer;">
                {{item.workflowTag}}
              </span>
            </el-tag>
            <el-tag :key="item.id" v-for="item in proposalTag" closable size="medium" :disable-transitions="false"
              @close="handleClose(item)">
              <span @click="Addtag(item)" style="cursor: pointer;">
                {{item.workflowTag}}
              </span>
            </el-tag>
            <el-input class="input-new-tag" v-if="inputVisible" v-model.trim="inputValue" ref="saveTagInput"
              size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
            </el-input>
            <el-button v-else class="button-new-tag" size="mini" @click="showInput">+</el-button>
          </div>
        </el-form>
      </div>
    </div>
    <div class="footer">
      <!-- 取消 -->
      <el-button class="urgent" type="primary" icon="el-icon-circle-close" size="small"
        @click="handleProcessClose">{{$t('button.close')}}</el-button>
      <!-- 确定 -->
      <el-button size="small" type="primary" icon="el-icon-circle-check" @click="handleProcessSave"
        v-fast-click>{{$t('button.determine')}}</el-button>
    </div>
    <!-- 选择人员 -->
    <el-dialog v-dialogDrag append-to-body :title="selectedUserTitle" center width="90%" top="5vh"
      :visible.sync="selectedUserDialog">
      <organizationUserTable v-if="selectedUserDialog" choice='isCheckbox' :isShow.sync="selectedUserDialog"
        :userList.sync="userList" :selectedUsers="selectedUsersList">
      </organizationUserTable>
    </el-dialog>
  </div>
</template>
<script>

export default {
  name: 'backProcess',
  data () {
    return {
      processNodeList: [], // 流程节点
      sendProcessForm: {
        comment: '',
        currentProcessNodeCode: '',
        isSendSms: 0,
        processCode: '',
        projectId: 0,
        sendUsers: [],
        sid: 0,
        taskId: 0,
        taskName: '',
        workflowTaskApproveNodes: []
      }, // 流程提交表单
      rules: {}, // 流程表单校验
      copyToUsersConfig: {
        // 显示的列表
        tagDada: [],
        // id
        rowKey: 'id',
        // name
        rowName: 'userName',
        // 默认显示的个数
        constNum: 8
      }, // 抄送人显示配置
      assigneeUsersConfig: {
        // 显示的列表
        tagDada: [],
        // id
        rowKey: 'id',
        // name
        rowName: 'userName',
        // 默认显示的个数
        constNum: 8
      }, // 审批人显示配置
      remindersList: [
        // 短信提醒
        { id: '0', name: 'dialog.SMSReminder' },
        // 邮件提醒
        { id: '1', name: 'dialog.emailReminder' }
      ], // 提醒方式
      confirmedTag: [{ workflowTag: this.$t('dialog.agree'), id: 0 }, { workflowTag: this.$t('dialog.handle'), id: 1 }], // 固定意见列表
      proposalTag: [],
      inputVisible: false,
      inputValue: '',
      selectedUserTitle: '', // 选人弹出框名称
      selectedUserDialog: false,
      selectedUsersList: [], // 已选中
      userList: [],
      userProcesstype: '', // approval 审批人 copy 抄送人
      processNodeSelectedList: [], // 选中的节点
      reminders: [], // 提醒方式
      comment: '',
      isCanCopyTo: true, // 是否必须抄送
      isCanChangeCopy: true, // 是否允许自由抄送
      checkMax: 1000, // 可被勾选节点的最大数
      nodeEnd: false // 结束节点
    };
  },
  components: {
    // 选人
    organizationUserTable (resolve) {
      require(['components/basicComponents/userDialog/organizationUserTable.vue'], resolve);
    },
    multipleChoice (resolve) {
      require(['../multipleChoice/multipleChoice'], resolve);
    }
  },
  props: {
    backForm: {
      type: Object,
      default: () => { }
    },
    // 流程类型
    processType: {
      type: String,
      default: 'next'
    }
  },
  created () {
    this.getProcessStartNode();
    this.getTag();
  },
  watch: {
    userList: {
      handler () {
        if (this.userProcesstype === 'copy') {
          this.copyToUsersConfig.tagDada = this.userList;
        }
      },
      deep: true
    }
  },
  methods: {
    // canChangeAssignee 是否允许自由选中节点审批人 0 是 1 否
    // canCopyTo 是否必须抄送 0 是 1 否
    // canChangeCopy 是否允许自由抄送  0 是 1 否
    // 获取开始节点信息
    getProcessStartNode () {
      const results = this.$clone(this.backForm);
      results.comment = '';
      this.sendProcessForm = results;
      this.reminders = [];
    },
    getTag () {
      this.$store.dispatch('task/tagList').then(res => {
        if (!res.results) return;
        this.proposalTag = res.results;
      });
    },
    // 标签函数
    handleClose (tag) {
      this.$store.dispatch('task/tagDelete', { tagId: tag.id }).then(res => {
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
      this.$store.dispatch('task/tagCreate', data).then(res => {
        this.getTag();
        this.inputVisible = false;
        this.inputValue = '';
      });
    },
    Addtag (val) {
      this.comment = val.workflowTag;
      this.sendProcessForm.comment = this.comment;
    },
    // 点击选择抄送人
    handleCopyToUsers () {
      this.userProcesstype = 'copy';
      this.selectedUsersList = this.copyToUsersConfig.tagDada;
      this.selectedUserTitle = this.$t('dialog.selectCc');
      this.selectedUserDialog = true;
    },
    // 删除抄送人
    handleCopyToUsersDelete (row) {
      const index = this.copyToUsersConfig.tagDada.findIndex(v => v.id === row.id);
      if (index >= 0) {
        this.copyToUsersConfig.tagDada.splice(index, 1);
      }
    },
    // 暂不提交
    handleProcessClose () {
      this.$emit('update:close', false);
    },
    // 确认提交 校验
    handleProcessSave () {
      this.setProcessData();
    },
    // 组合数据
    setProcessData () {
      const sendUsers = this.copyToUsersConfig.tagDada.map(v => v.id);
      this.handleProcessDataSubmit(sendUsers);
    },
    handleProcessDataSubmit (sendUsers) {
      const isSendSms = this.reminders.findIndex(v => v === '0') >= 0 ? 1 : 0;
      const isSendEmail = this.reminders.findIndex(v => v === '1') >= 0 ? 1 : 0;
      const data = {
        comment: this.sendProcessForm.comment,
        currentProcessNodeCode: this.sendProcessForm.processNodeCode,
        isSendSms,
        isSendEmail,
        processCode: this.sendProcessForm.processCode,
        projectId: this.sendProcessForm.projectId || '',
        sendUsers,
        sid: this.sendProcessForm.taskSid,
        taskId: this.sendProcessForm.taskId,
        taskName: this.sendProcessForm.taskName,
        workflowTaskApproveNodes: [],
        formCode: this.sendProcessForm.formCode,
        tenantId: this.$utils.Auth.hasUserInfo().tenantId,
        createBy: this.$utils.Auth.hasUserInfo().userId
      };
      this._setProcessStatusBack(data);
    },
    // 流程撤回
    _setProcessStatusBack (data) {
      this.$store.dispatch('task/processBack', data).then(res => {
        if (res.status === 0) {
          this.handleProcessClose();
          this.$message.success(`${this.$t('button.backProcess')} ${this.$t('tips.success')}`);
        } else {
          this.$message.error(this.$t(`exception.${res.errorCode}`));
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.sendProcess {
  min-height: 400px;
  max-height: 450px;
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
  }
  .input-new-tag {
    margin-top: 10px;
  }
}
.footer {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 10px;
}
</style>
