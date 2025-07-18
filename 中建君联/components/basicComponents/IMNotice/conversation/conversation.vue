<template>
  <div ref="conversation">
    <el-container slot="container" class="full-height" :style="{ height: `${dialogHeight - 20}px` }">
      <!-- 左侧侧边栏 -->
      <el-aside width="50%" class="aside-box" :style="{ height: `${dialogHeight - 20}px` }">
        <el-container class="full-height fixed-scroll" style="margin: 10px 10px 0 0" direction="vertical">
          <div class="full-height-button">
            <el-button size="small" type="primary" icon="el-icon-circle-check" @click="handleSend" v-fast-click>发送
            </el-button>
            <el-button class="other" type="primary" icon="el-icon-refresh" size="small" @click="handleClear">清空
            </el-button>
          </div>
          <el-form ref="projectForm" label-position="left" :model="projectForm" :rules="rules" label-width="150px"
            class="demo-ruleForm">
            <!-- @谁 -->
            <el-form-item :label="$t('dialog.receiverUsers')" prop="receiverUsers" :title="$t('dialog.receiverUsers')">
              <el-select v-model.trim="projectForm.receiverUsers" size="small" clearable :multiple="true"
                :filterable="true" style="width: 100%">
                <el-option v-for="(child, i) in processUserList" :key="i" :label="child.userName"
                  :value="child.taskDetailId">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- 消息内容 -->
            <el-form-item :label="$t('dialog.messageContent')" prop="messageContent"
              :title="$t('dialog.messageContent')">
              <el-input type="textarea" v-model="projectForm.messageContent" size="small" clearable :maxlength="256"
                show-word-limit :autosize="{ minRows: 4, maxRows: 8 }">
              </el-input>
            </el-form-item>
            <!-- 附件  -->
            <el-form-item :label="$t('fConfig.attachment')" prop="attachmentId" :title="$t('fConfig.attachment')">
              <file-upload :attachment.sync="projectForm.attachmentId" :flowStatus="false" :arrayNumber="1" :limit="3"
                :multiple="false">
              </file-upload>
            </el-form-item>
          </el-form>
        </el-container>
      </el-aside>

      <!-- 聊天面板容器 -->
      <el-main class="ov-hidden full-height no-padding">
        <WelcomeModule v-if="indexName === null" />
        <TalkPanel v-else ref="TalkPanel" class="full-height" :params="params" />
      </el-main>
    </el-container>
  </div>
</template>
<script>
import { webSocketMixins } from 'mixins/webSocketMixins';

export default {
  name: 'conversation',
  mixins: [webSocketMixins],
  components: {
    TalkPanel (resolve) {
      require(['./TalkPanel.vue'], resolve);
    },
    WelcomeModule (resolve) {
      require(['../messaege/WelcomeModule.vue'], resolve);
    },
    fileUpload (resolve) {
      require(['components/basicComponents/global/upload/fileUpload.vue'], resolve);
    }
  },
  data () {
    const receiverUsersValid = (rule, value, callback) => {
      if (!value.length) {
        callback(new Error(`${this.$t('tips.pleaseSelect')}${this.$t('dialog.receiverUsers')}`));
      } else {
        callback();
      }
    };
    return {
      // 对话面板的传递参数
      params: {
        messageType: null,
        sessionMessageId: null
      },

      indexName: '',
      projectForm: {
        messageType: '01',
        attachmentId: '',
        content: '',
        taskId: '',
        sessionMessageId: null,
        formCode: '',
        taskName: '',
        receiverIds: [],
        receiverUsers: []
      },
      cloneProjectForm: {},
      processUserList: [],
      rules: {
        receiverUsers: [{ required: true, validator: receiverUsersValid, trigger: 'change' }],
        messageContent: [{ required: true, message: `${this.$t('tips.pleaseEnter')}${this.$t('dialog.messageContent')}`, trigger: 'blur' }]
      }
    };
  },
  props: {
    taskDetailId: {
      default: 0
    },
    dialogHeight: {
      default: 500
    }
  },
  created () {
    this.websocketTaskQueryInfo();
  },
  watch: {
    arr: {
      handler () {
        console.log(this.arr, 'arr');
      },
      deep: true
    }
  },
  methods: {
    // 获取流程详情
    // 查询流程详细信息
    websocketTaskQueryInfo () {
      this.$store.dispatch('processApi/workflowTaskDetailInfo', { taskDetailId: this.taskDetailId }).then(res => {
        if (res.status === 0) {
          const results = res.results;
          this.projectForm.formCode = results.formCode;
          this.projectForm.taskName = results.taskName;
          this.projectForm.taskId = results.taskId;
          this.cloneProjectForm = this.$clone(this.projectForm);
          this.getProcessUserList(results.taskId);
        } else {
          this.$message.error(`${res.errorMessage}`);
        }
      });
    },
    // 获取流程中已审批用户几当前用户
    getProcessUserList (taskId) {
      this.$store.dispatch('processApi/getTasksQueryLogs', { taskId }).then(res => {
        const userList = [];
        for (const item of res.results) {
          userList.push({
            assigneeName: item.assigneeName,
            userName: `${item.assigneeName}-${item.nodeName}`,
            receiverUserId: item.assigneeId,
            taskDetailId: item.id
          });
        }
        this.processUserList = userList;
        this.params = {
          messageType: '01',
          taskId: this.projectForm.taskId
        };
      });
    },
    // 发送
    handleSend () {
      this.$refs.projectForm.validate(valid => {
        if (valid) {
          const receiverIds = [];
          const receiverUsers = this.projectForm.receiverUsers;
          for (const item of receiverUsers) {
            const index = this.processUserList.findIndex(v => v.taskDetailId === item);
            if (index >= 0) {
              receiverIds.push({
                receiverUserId: this.processUserList[index].receiverUserId,
                taskDetailId: this.processUserList[index].taskDetailId,
                userName: this.processUserList[index].assigneeName
              });
            }
          }
          this.projectForm.receiverIds = receiverIds;
          const data = {
            attachmentId: this.projectForm.attachmentId,
            content: this.projectForm.messageContent,
            formCode: this.projectForm.formCode,
            messageType: this.projectForm.messageType,
            receiverIds,
            sessionMessageId: this.projectForm.sessionMessageId,
            taskId: this.projectForm.taskId,
            taskName: this.projectForm.taskName
          };
          this.websocketsend(data);
          this.handleClear();
        }
      });
    },
    // 清空
    handleClear () {
      this.projectForm = this.$clone(this.cloneProjectForm);
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/.el-scrollbar__wrap {
  overflow-x: hidden;
}
.full-height-button {
  text-align: right;
  margin-bottom: 10px;
}
.aside-box {
  position: relative;
  border-right: 1px solid rgb(245, 245, 245);
  overflow: hidden;
  padding: 0;
  transition: width 0.3s;

  .header {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 15px;

    .from-search {
      flex: 1 1;
      flex-shrink: 0;
      height: 40px;

      /deep/ .el-input .el-input__inner {
        border-radius: 20px;
      }
    }

    .tools {
      flex-basis: 32px;
      flex-shrink: 0;
      height: 32px;
      margin-bottom: 8px;
      margin-left: 15px;
      cursor: pointer;
      line-height: 32px;
      text-align: center;
      position: relative;
      user-select: none;

      .tools-menu {
        position: absolute;
        right: 0;
        top: 38px;
        width: 100px;
        min-height: 80px;
        box-sizing: border-box;
        background-color: rgba(31, 35, 41, 0.9);
        border-radius: 5px;
        z-index: 1;
        padding: 3px 0;

        .menu-item {
          height: 40px;
          line-height: 40px;
          color: white;
          font-size: 14px;

          &:hover {
            background-color: rgba(70, 72, 73, 0.9);
          }
        }
      }
    }
  }

  .subheader {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 3px 8px 10px;
    overflow: hidden;
    flex-shrink: 0;

    .top-item {
      flex-basis: 41px;
      flex-shrink: 0;
      height: 50px;
      margin: 0 1px 6px 1px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;

      .avatar {
        flex-basis: 32px;
        width: 32px;
        height: 32px;
        background-color: #508afe;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 10px;
        color: white;
        flex-shrink: 0;
        overflow: hidden;
        user-select: none;

        img {
          width: 100%;
          height: 100%;
          background-color: white;
        }
      }

      .name {
        font-size: 12px;
        text-align: center;
        color: #8f959e;
        transform: scale(0.84);
        text-align: center;
        line-height: 20px;
        word-break: break-all;
        overflow: hidden;

        &.active {
          color: #508afe;
        }
      }
    }

    &.shadow {
      box-shadow: 0 2px 6px 0 rgba(31, 35, 41, 0.05);
    }
  }
}

.aside-box .main {
  overflow: hidden;
  padding: 0;

  .empty-data {
    text-align: center;
    padding-top: 40px;
    color: #ccc;
  }

  .main-menu {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 3px 10px 3px 10px;
    align-items: center;
    user-select: none;

    .title {
      font-size: 12px;
      font-weight: 600;
      color: #1f2329;
    }

    .icon {
      cursor: pointer;
    }
  }

  .talk-item {
    padding: 8px 10px;
    height: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-left: 3px solid transparent;
    transition: 0.2s ease-in;

    .avatar-box {
      height: 35px;
      width: 35px;
      flex-shrink: 0;
      background-color: #508afe;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      color: white;
      user-select: none;
      transition: ease 1s;
      position: relative;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        background-color: white;
        border-radius: 3px;
      }

      .top-mask {
        width: 100%;
        height: 100%;
        background-color: rgba(22, 25, 29, 0.6);
        position: absolute;
        top: 0;
        left: 0;
        color: white;
        display: none;
        align-items: center;
        justify-content: center;
        font-weight: bold;
      }

      &:hover .top-mask {
        display: flex;
      }
    }

    .card-box {
      height: 40px;
      display: flex;
      align-content: center;
      flex-direction: column;
      flex: 1 1;
      margin-left: 10px;
      overflow: hidden;

      .title {
        width: 100%;
        height: 20px;
        display: flex;
        align-items: center;

        .card-name {
          color: #1f2329;
          font-size: 14px;
          line-height: 20px;
          flex: 1 1;
          display: -webkit-flex;
          display: -ms-flexbox;
          display: flex;
          align-items: center;
          overflow: hidden;

          .nickname {
            font-weight: 400;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-right: 3px;
          }

          .top {
            color: #dc9b04 !important;
            background-color: #faf1d1 !important;
          }

          .group {
            color: #3370ff !important;
            background-color: #e1eaff !important;
            font-size: 13px;
          }

          .disturb {
            color: #98999c !important;
            background-color: #ecedf1 !important;
            i {
              font-size: 12px;
            }
          }
        }
      }

      .card-time {
        color: #8f959e;
        font-size: 12px;
        margin-left: 10px;
        user-select: none;
      }

      .content {
        font-size: 13px;
        line-height: 18px;
        color: #8f959e;
        margin-top: 3px;
        font-weight: 300;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;

        span:first-child {
          margin-right: 5px;
        }

        .online-color {
          color: #4aa71c;
          font-weight: 300;
        }

        .draft-color {
          color: #ff4a4a;
          font-weight: 300;
        }
      }
    }

    &:hover {
      background-color: #eff0f1;
    }

    &.active {
      border-color: #3370ff;
      background-color: #eff0f1;
    }
  }
}

@media screen and (max-width: 800px) {
  .aside-box {
    width: 220px !important;

    .subheader {
      display: none;
    }

    .card-box .larkc-tag {
      display: none;
    }
  }
}
</style>
