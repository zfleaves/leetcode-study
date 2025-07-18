<!--
 * @Author: your name
 * @Date: 2020-07-15 15:00:42
 * @LastEditTime: 2023-05-05 17:21:10
 * @LastEditors: zengqin 1058574586@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_unit\src\components\basicComponents\process\sendProcess.vue
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
            <el-input v-model.trim="sendProcessForm.taskName" size="small" disabled maxlength="255" show-word-limit>
            </el-input>
          </el-form-item>
          <!-- 金额 -->
          <el-form-item v-if="parentNodeCode === 'BEGIN'" :label="$t('fConfig.amount')" prop="businessAmount"
            :title="$t('fConfig.amount')"
            :rules="[{required: amountControlRule === 1,  message: `${$t('tips.pleaseEnter')}${$t('fConfig.amount')}`, trigger: 'blur'}]">
            <el-number v-model="sendProcessForm.businessAmount" :placeholder="$t('dialog.businessAmountTips')"
              size="small" clearable :maxlength="17" :precision="2" show-word-limit>
            </el-number>
            <!-- 请正确填写此单据的总金额，切勿因错误填写影响审批。 -->
          </el-form-item>
          <!-- 选择下一步办理节点 -->
          <el-form-item v-if="processType === 'next' && isProcessOver" :label="$t('dialog.selectNextNode')"
            prop="processNode" :title="$t('dialog.selectNextNode')">
            <el-checkbox-group v-model="selectedProcessNode" :max="checkMax" size="small">
              <el-checkbox v-for="(column,key) in processNodeList" :key="key" :label="column.processNodeCode"
                :name="column.processNodeCode" @change="handleProcessNodeChange(column, key)">
                {{column.processNodeName}}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <template v-if="processType === 'next' && isProcessOver">
            <template v-for="processNode in processNodeSelectedList">
              <div :key="processNode.processNodeCode"
                @click="handleCanChangeAssignee(processNode, 'canChangeAssignee')">
                <el-form-item :label="processNode.processNodeName" prop="copyToUsers"
                  :title="processNode.processNodeName">
                  <check-choice :ref="processNode.processNodeCode" :selectConfig="assigneeUsersConfig"
                    :userList="processNode.assigneeUsers" :selectAssigneeUsers.sync="processNode.assigneeUsers"
                    :processDisabled="processNode.canChangeAssignee === 2 ? false : true"
                    :isDisabled="processNode.canChangeAssignee !== 1 && processNode.canChangeAssignee !== 2"
                    @tagDelete="handleTagDelete(processNode, $event)" @select="handleApprovalUser(processNode)">
                  </check-choice>
                </el-form-item>
              </div>
            </template>
          </template>
          <!-- 选择抄送人 -->
          <div @click="handleCanChangeAssignee(copyToUsersConfig, 'canChangeCopyAssignee')"
            v-if="isProcessOver || (processType !== 'next')">
            <el-form-item :label="$t('dialog.selectCc')" prop="copyToUsers" :title="$t('dialog.selectCc')">
              <check-choice ref="copyToUsersData" :selectConfig="copyToUsersConfig"
                :selectAssigneeUsers.sync="copyToUsersConfig.tagDada"
                :processDisabled="copyToUsersConfig.canChangeCopyAssignee === 2 ? false : true"
                :isDisabled="copyToUsersConfig.canChangeCopyAssignee !== 1 && copyToUsersConfig.canChangeCopyAssignee !== 2"
                @tagDelete="handleCopyToUsersDelete" @select="handleCopyToUsers">
              </check-choice>
            </el-form-item>
          </div>
          <!-- 选择提醒方式 -->
          <el-form-item :label="$t('dialog.selectAReminderMethod')" prop="reminders"
            v-if="isProcessOver || (processType !== 'next')" :title="$t('dialog.selectAReminderMethod')">
            <el-checkbox-group v-model="reminders" size="small" @change="handleRemindersChange">
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
          <el-form-item :label="$t('dialog.myOpinion')" :prop="processType !== 'next' ? 'comment' : ''"
            :title="$t('dialog.myOpinion')">
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
          <p style="margin-bottom: 10px;color: '#ACABAB'" v-if="!isProcessOver && processType === 'next'">
            {{$t('dialog.processOverTips')}}</p>
        </el-form>
      </div>
    </div>
    <div class="footer">
      <!-- 暂不提交 -->
      <el-button class="urgent" type="primary" icon="el-icon-circle-close" size="small"
        @click="handleProcessClose">{{$t('button.notToSubmit')}}</el-button>
      <!-- 确认提交 -->
      <el-button size="small" type="primary" icon="el-icon-circle-check" @click="handleProcessSave"
        v-fast-click>{{$t('button.confirmSubmission')}}</el-button>
    </div>
    <!-- 选择人员 -->
    <el-dialog v-dialogDrag append-to-body :title="selectedUserTitle" center width="90%" top="5vh"
      :visible.sync="selectedUserDialog" v-if="selectedUserDialog">
      <template v-if="nodeIdentifyCode === 'supplier'">
        <partnerUserTable choice='isCheckbox' :isShow.sync="selectedUserDialog" :userList.sync="userList"
          :selectedUsers="selectedUsersList" :isBelongCompanyChangeAssignee='isBelongCompanyChangeAssignee || null'
          :belongCompanyId='dataInfo.belongCompanyId'>
        </partnerUserTable>
      </template>
      <template v-if="nodeIdentifyCode === 'customer'">
        <organizationUserTable choice='isCheckbox' :isShow.sync="selectedUserDialog" :userList.sync="userList"
          :selectedUsers="selectedUsersList" :isBelongCompanyChangeAssignee='isBelongCompanyChangeAssignee || null'
          :belongCompanyId='dataInfo.belongCompanyId'>
        </organizationUserTable>
      </template>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      processNodeList: [], // 流程节点
      sendProcessForm: {
        businessAmount: '',
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
      rules: {
        comment: [
          { required: true, message: `${this.$t('tips.pleaseEnter')}${this.$t('dialog.myOpinion')}`, trigger: 'blur' }
        ]
      }, // 流程表单校验
      // 选择抄送人
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
      businessApprovalConfig: {
        // 显示的列表
        tagDada: [],
        // id
        rowKey: 'id',
        // name
        rowName: 'userName',
        // 默认显示的个数
        constNum: 8
      }, // 业务审批人显示配置
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
        { id: '0', name: 'dialog.SMSReminder', disabled: false, tips: '' },
        // 邮件提醒
        { id: '1', name: 'dialog.emailReminder', disabled: false, tips: '' }
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
      selectedProcessNode: [], // 选中的节点
      reminders: [], // 提醒方式
      comment: '',
      isCanCopyTo: true, // 是否必须抄送
      isCanChangeCopy: true, // 是否允许自由抄送
      currentNodeCode: '', // 节点状态
      checkMax: 1000, // 可被勾选节点的最大数
      nodeEnd: false, // 结束节点
      isProcessOver: true, // 判断当前分支节点是否已经执行完成(不包含当前节点) true表示已经执行完成，false表示没执行完成
      dataInfo: {}, // 业务详细数据
      amountControlRule: 0,
      parentNodeCode: '', // 当前节点状态
      loadingSubmit: null,
      isBelongCompanyChangeAssignee: null,
      nodeIdentifyCode: '' // 节点身份
    };
  },
  computed: {
    text () {
      return this.$refs.text;
    }
  },
  components: {
    checkChoice (resolve) {
      require(['../global/multipleChoice/checkChoice'], resolve);
    },
    // 选人
    organizationUserTable (resolve) {
      require(['components/basicComponents/userDialog/organizationUserTable'], resolve);
    },
    // 合作方-选人
    partnerUserTable (resolve) {
      require(['components/basicComponents/userDialog/partnerUserTable'], resolve);
    }
  },
  props: {
    nextForm: {
      type: Object,
      default: () => { }
    },
    processSubmitApi: {
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
    this.parentNodeCode = this.$parent && this.$parent.$parent ? this.$parent.$parent.nodeCode : '';
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
              let assigneeUsers = this.$clone(item.assigneeUsers);
              if (this.userList.length === 0) {
                item.assigneeUsers = [];
              } else if (assigneeUsers.length === 0) {
                assigneeUsers = this.userList;
                for (const as of assigneeUsers) {
                  as.isChecked = true;
                }
                item.assigneeUsers = assigneeUsers;
              } else {
                for (const item of this.userList) {
                  item.isChecked = true;
                }
                item.assigneeUsers = this.userList;
              }
              // ---------------------
            }
          });
        }
      },
      deep: true
    },
    isBelongCompanyChangeAssignee: {
      handler () {

      },
      immediate: true
    }
  },

  methods: {
    // canChangeAssignee 是否允许自由选中节点审批人 0 是 1 否 2 默认全部勾选上 3. 在公司用户范围内，且不允许取消勾选
    // canCopyTo 是否必须抄送 0 是 1 否
    // canChangeCopy 是否允许自由抄送  0 是 1 否
    // 获取开始节点信息
    async getProcessStartNode () {
      const results = this.$clone(this.nextForm);
      const overData = {
        processNodeCode: results.workflowNextNodes.currentProcessNodeCode,
        taskId: results.taskId
      };
      const overRes = await this.$store.dispatch('publicApi/judgeProcessOver', overData);
      // true表示已经执行完成，false表示没执行完成
      this.isProcessOver = overRes.results;
      results.comment = '';
      this.sendProcessForm = results;
      // ---------------------
      // console.log(results.workflowNextNodes.nextNodes, 'nextNodes');
      results.workflowNextNodes.nextNodes && results.workflowNextNodes.nextNodes.forEach(v => {
        // 默认带出的处理人只有一个用户，默认勾选上
        v.assigneeUsers.forEach(a => {
          a.isChecked = v.assigneeUsers.length === 1 || v.canChangeAssignee === 2;
        });
      });
      this.amountControlRule = results.workflowNextNodes.amountControlRule;
      this.processNodeList = results.workflowNextNodes.nextNodes;
      console.log(this.processNodeList, 'this.processNodeList');
      // ---------------------
      this.currentNodeCode = results.workflowNextNodes.currentNodeCode;
      console.log(this.currentNodeCode, 'this.currentNodeCode');
      if (this.processNodeList.some(v => v.canCopyTo === 1)) {
        this.isCanCopyTo = false;
      }
      if (this.processNodeList.some(v => v.canChangeCopy === 1)) {
        this.isCanChangeCopy = false;
      }
      this.selectedProcessNode = [];
      this.reminders = [];
      if (this.processNodeList.length) {
        if (this.currentNodeCode !== 'EXCLUSION' || this.processNodeList[0].nodeCode !== 'END') { // 不是排他分支时 默认勾选第一个
          this.selectedProcessNode = [this.processNodeList[0].processNodeCode];
          this.handleProcessNodeChange(this.processNodeList[0], 0);
        }
        // this.selectedProcessNode = [this.processNodeList[0].processNodeCode];
        // this.handleProcessNodeChange(this.processNodeList[0], 0);
        // 设置提醒方式
        this.setReminders();
      }
      if (this.currentNodeCode === 'PARALLEL') {
        this.parallelRule();
      }
      if (this.processNodeList && this.processNodeList[0].nodeCode === 'END') {
        this.nodeEnd = true;
        this.selectedProcessNode = this.processNodeList.map(v => v.processNodeCode);
      }
    },
    // 设置提醒方式
    setReminders () {
      if (this.processNodeList.some(v => v.isSendSms === 1 || v.isSendSms === 2)) {
        this.reminders.push('0');
      }
      if (this.processNodeList.some(v => v.isSendEmail === 1 || v.isSendEmail === 2)) {
        this.reminders.push('1');
      }
      if (this.processNodeList.some(v => v.isSendSms === 2)) {
        this.remindersList[0].disabled = true;
        this.remindersList[0].tips = this.$t('dialog.forceSendSmsTips');
      }
      if (this.processNodeList.some(v => v.isSendSms === 3)) {
        this.remindersList[0].disabled = true;
        this.remindersList[0].tips = this.$t('dialog.notForceSendSmsTips');
      }
      if (this.processNodeList.some(v => v.isSendEmail === 2)) {
        this.remindersList[1].disabled = true;
        this.remindersList[1].tips = this.$t('dialog.forceSendEmailTips');
      }
      if (this.processNodeList.some(v => v.isSendEmail === 3)) {
        this.remindersList[1].disabled = true;
        this.remindersList[1].tips = this.$t('dialog.notForceSendEmailTips');
      }
    },
    // 并行
    parallelRule () {
      let copyUsers = [];
      this.selectedProcessNode = this.processNodeList.map(v => v.processNodeCode);
      this.processNodeSelectedList = this.processNodeList;
      this.processNodeSelectedList.forEach(item => {
        this.getBusinessApprovalUser(item, () => {
          copyUsers = copyUsers.concat(item.copyToUsers);
        });
      });
      this.copyToUsersConfig.tagDada = this.unique(copyUsers);
    },
    // 选择流程节点后
    handleProcessNodeChange (column, key) {
      // PARALLEL
      if (this.currentNodeCode === 'PARALLEL') {
        this.parallelRule();
        return;
      }
      // EXCLUSION
      if (this.currentNodeCode === 'EXCLUSION') {
        this.checkMax = 1;
      }
      // END
      if (column.nodeCode === 'END') {
        this.selectedProcessNode = this.processNodeList.map(v => v.processNodeCode);
        // return;
      }
      this.processNodeSelectedList = [];
      this.copyToUsersConfig.tagDada = [];
      let copyUsers = [];
      // 审批节点
      this.processNodeList.forEach(item => {
        const index = this.selectedProcessNode.findIndex(v => v === item.processNodeCode);
        if (index >= 0) {
          this.getBusinessApprovalUser(item, (data) => {
            if (column.nodeCode !== 'END') {
              this.processNodeSelectedList.push(data);
            }
            // 默认带出的抄送人只有一个用户，默认勾选上
            item.copyToUsers.forEach(a => {
              this.$set(a, 'isChecked', item.copyToUsers.length === 1 || item.canChangeCopyAssignee === 2);
              console.log(a.isChecked, 'a.isChecked');
            });
            copyUsers = copyUsers.concat(item.copyToUsers);
          });
          this.$set(this.copyToUsersConfig, 'canChangeCopyAssignee', item.canChangeCopyAssignee);
        }
      });

      this.copyToUsersConfig.tagDada = this.unique(copyUsers);
    },
    // 获取审批人
    async getBusinessApprovalUser (item, callback) {
      const chooseColumnValue = this.dataInfo[item.chooseColumnValue];
      if (!chooseColumnValue) {
        callback && callback(item);
        return;
      }
      let value = '';
      if (typeof chooseColumnValue === 'string') {
        value = chooseColumnValue;
      } else {
        value = JSON.stringify(this.dataInfo[item.chooseColumnValue]);
      }
      const userIds = value.split(',');
      await this.$store.dispatch('publicApi/getUserInfosListPublic', userIds).then(res => {
        for (const a of res.results) {
          a.id = a.userId;
          const index = item.assigneeUsers.findIndex(v => v.id === a.id);
          index < 0 && item.assigneeUsers.unshift(a);
          // 默认带出的处理人只有一个用户，默认勾选上
          item.assigneeUsers.forEach(a => {
            a.isChecked = item.assigneeUsers.length === 1 || item.canChangeAssignee === 2;
          });
        }
        callback && callback(item);
      }).catch(e => {
        callback && callback(item);
      });
    },
    unique (arr) {
      const list = []; // 选中
      arr.forEach(item => {
        item.isChecked = item.isChecked || false;
        const index = list.findIndex(v => v.id === item.id);
        if (index < 0) {
          list.push(item);
        }
      });
      return list;
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
    // 点击选择抄送人
    handleCopyToUsers () {
      // 节点必须选择一个
      if (this.processNodeSelectedList.length === 0) {
        this.$message.error(this.$t('dialog.selectOne'));
        return;
      }
      this.nodeIdentifyCode = this.processNodeSelectedList[0].nodeIdentifyCode;
      const copyToUsersData = this.$refs.copyToUsersData.tagDadaList.filter(v => v.isChecked);
      this.userProcesstype = 'copy';
      this.selectedUsersList = copyToUsersData;
      this.selectedUserTitle = this.$t('dialog.selectCc');
      setTimeout(() => {
        this.selectedUserDialog = true;
      }, 100);
    },
    // 点击选择审批人
    handleApprovalUser (processNode) {
      // ---------------------
      const assigneeUsers = this.$refs[processNode.processNodeCode][0].tagDadaList.filter(v => v.isChecked);
      this.userProcesstype = processNode.processNodeCode;
      this.selectedUsersList = assigneeUsers;
      this.selectedUserTitle = this.$t('dialog.selectReviewer');
      this.nodeIdentifyCode = processNode.nodeIdentifyCode;
      setTimeout(() => {
        this.selectedUserDialog = true;
      }, 100);
      // ---------------------
    },
    // 删除审批人
    handleTagDelete (processNode, row) {
      this.processNodeSelectedList.forEach(item => {
        if (processNode.processNodeCode === item.processNodeCode) {
          const index = item.assigneeUsers.findIndex(v => v.id === row.id);
          if (index >= 0) {
            item.assigneeUsers.splice(index, 1);
          }
        }
      });
    },
    // 删除抄送人
    handleCopyToUsersDelete (row) {
      const index = this.copyToUsersConfig.tagDada.findIndex(v => v.id === row.id);
      if (index >= 0) {
        this.copyToUsersConfig.tagDada.splice(index, 1);
      }
    },
    // 选择提醒方式
    handleRemindersChange (value) { },
    // 暂不提交
    handleProcessClose () {
      this.$emit('closeDialog', false);
    },
    // 是否允许自由选中节点审批人 提示
    handleCanChangeAssignee (node, code) {
      this.isBelongCompanyChangeAssignee = node[code];
      if (node[code] === 2) {
        // 节点选人模式约束为全体执行，您不能取消勾选。
        this.$message.error(this.$t('dialog.canChangeAssignee2Tips'));
      }
    },
    // 确认提交 校验
    async handleProcessSave () {
      this.$refs.sendProcessForm.validate((valid) => {
        if (valid) {
          this.processSave();
        }
      });
    },
    async processSave () {
      if (this.processType === 'next') {
        const overData = {
          processNodeCode: this.sendProcessForm.workflowNextNodes.currentProcessNodeCode,
          taskId: this.sendProcessForm.taskId
        };
        const overRes = await this.$store.dispatch('publicApi/judgeProcessOver', overData);
        // true 表示已经执行完成  有选人有弹窗 走抄送
        // false表示没执行完成
        this.isProcessOver = overRes.results;
        // console.log(overRes, 'overRes');
        const copyToUsersData = this.copyToUsersConfig.tagDada.filter(v => v.isChecked);
        // console.log(copyToUsersData.length, 'copyToUsersData');
        // 校验必须抄送
        // console.log(this.isCanCopyTo, copyToUsersData.length === 0, this.isProcessOver, 'isProcessOver11');
        // console.log(this.processType, 'this.processType');
        if (copyToUsersData.length === 0 && this.isCanCopyTo && this.isProcessOver) {
          // 该节点已设置必须抄送, 请添加节点抄送人 操作提示
          this.$alert(`<h3 style="color:red">${this.$t('dialog.ccTips1')}</h3>`, this.$t('dialog.ccTips'), {
            dangerouslyUseHTMLString: true
          });
          return;
        }
        // 节点必须选择一个
        console.log(this.selectedProcessNode.length, this.isProcessOver, 'isProcessOver');
        if (this.selectedProcessNode.length === 0 && this.isProcessOver) {
          this.$message.error(this.$t('dialog.selectOne'));
          return;
        }
      }
      // console.log(11111111, 'overRes');
      this.setProcessData();
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
      const workflowTaskApproveNodes = [];
      const copyToUsersData = this.copyToUsersConfig.tagDada.filter(v => v.isChecked);
      const sendUsers = copyToUsersData.map(v => v.id);
      // 结束
      if (this.nodeEnd && this.processType === 'next' && this.isProcessOver) {
        // 提交后本条数据将更新为已审批状态。 已审批状态的数据不能撤回，不能修改，不能删除。
        const mseeage = `${this.$t('dialog.nextTips1')}<br><span style="color:red;">${this.$t('dialog.nextTips2')}</span>`;
        //  提交流程
        this.$confirm(mseeage, this.$t('button.startProcess'), {
          cancelButtonClass: 'button-close',
          dangerouslyUseHTMLString: true,
          confirmButtonText: this.$t('button.determine'),
          cancelButtonText: this.$t('button.close'),
          type: 'warning'
        }).then(() => {
          this.handleProcessDataSubmit(sendUsers, workflowTaskApproveNodes);
        }).catch(e => {
        });
      } else {
        for (const item of processNodeSelectedList) {
          // ---------------------
          const assigneeUsers = item.assigneeUsers.filter(v => v.isChecked);
          if (assigneeUsers.length === 0 && this.processType === 'next' && this.isProcessOver) {
            if (item.canChangeAssignee === 1 && assigneeUsers.length === 0) {
              // 该节点不允许自主选择审批人, 请设置为允许自主选择审批人
              this.$alert(`<h3 style="color:red">${this.$t('dialog.youMustSelectOne')}, ${this.$t('dialog.canChangeAssigneeTips')}</h3>`, this.$t('dialog.ccTips'), {
                dangerouslyUseHTMLString: true
              });
              return;
            }
            // 所选节点中审批人必选一个
            this.$message.error(this.$t('dialog.youMustSelectOne'));
            return;
          }
          workflowTaskApproveNodes.push(
            {
              assigneeIds: assigneeUsers.map(v => v.id),
              processNodeCode: item.processNodeCode

            }
          );
        }
        this.handleProcessDataSubmit(sendUsers, workflowTaskApproveNodes);
      }
    },
    handleProcessDataSubmit (sendUsers, workflowTaskApproveNodes) {
      this.loadingSubmit = this.$loading({
        lock: true,
        background: 'rgba(0,0,0,0.7)',
        spinner: 'el-icon-loading'
      });
      const isSendSms = this.reminders.findIndex(v => v === '0') >= 0 ? 1 : 0;
      const isSendEmail = this.reminders.findIndex(v => v === '1') >= 0 ? 1 : 0;
      const data = {
        formCode: this.sendProcessForm.formCode,
        businessAmount: this.sendProcessForm.businessAmount,
        comment: this.sendProcessForm.comment,
        currentProcessNodeCode: this.sendProcessForm.workflowNextNodes.currentProcessNodeCode,
        isSendSms,
        isSendEmail,
        processCode: this.sendProcessForm.workflowNextNodes.processCode,
        projectId: this.sendProcessForm.projectId,
        sendUsers,
        sid: this.sendProcessForm.sid,
        taskId: this.sendProcessForm.taskId,
        taskName: this.sendProcessForm.taskName,
        workflowTaskApproveNodes,
        createBy: this.$utils.Auth.hasUserInfo().userId,
        createByName: this.$utils.Auth.hasUserInfo().userName
      };
      this.handleProcessSubmit(data);
    },
    // 流程提交
    handleProcessSubmit (data) {
      let url = '';
      if (this.processType === 'next') {
        url = this.processSubmitApi.approveSubmit.url;
        this.$emit('nextProcess', { url, data });
        this.loadingSubmit.close();
      }
      // 返回上一步
      if (this.processType === 'returnPrev') {
        url = 'processApi/workflowProcessReturnPrev';
        data.createBy = this.$utils.Auth.hasUserInfo().userId;
        this._setProcessStatusSubmit(url, data);
      }
      // 退回发起人
      if (this.processType === 'returnStart') {
        url = 'processApi/workflowProcessReturnStart';
        data.createBy = this.$utils.Auth.hasUserInfo().userId;
        this._setProcessStatusSubmit(url, data);
      }
    },
    _setProcessStatusSubmit (url, data) {
      this.$store.dispatch(url, data).then(res => {
        if (res.status === 0) {
          this.handleProcessClose();
          this.$emit('submitPorcess', true);
          this.$message.success(this.$t(`tips.${this.processType}`));
          this.loadingSubmit.close();
        } else {
          this.$message.error(this.$t(`exception.${res.errorCode}`));
          this.loadingSubmit.close();
        }
      }).catch(e => {
        this.loadingSubmit.close();
      });
    }
  },
  beforeDestroy () {
    this.loadingSubmit && this.loadingSubmit.close();
  }
};
</script>
<style lang="scss" scoped>
.sendProcess {
  min-height: 600px;
  max-height: 650px;
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
