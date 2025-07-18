<!--
 * @Author: your name
 * @Date: 2020-06-28 09:08:48
 * @LastEditTime: 2022-09-16 16:07:07
 * @LastEditors: zengqin 1058574586@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_basicconfiguration-企业信息及配置\src\components\global\editTitle\editTitle.vue
-->
<template>
  <div class="edit-title" ref="editTitle" :class="titleTips ? 'titleTips' : ''">
    <div class="title">
      <span ref="titleTips" class="titleTips">{{title}}</span>
      <slot name="tips"></slot>
      <span class="approval" ref="approvalTips" v-if="approval">（{{approval}}）</span>
      <span class="be-careful" v-if="titleTips">
        <tooltips :value="$t(titleTips)" :title="$t(titleTips)"></tooltips>
      </span>
    </div>
    <div class="set" :class="concatButtonFlag ? 'edit-title-set' : ''" ref="editButton">
      <!-- @互动消息 -->
      <!-- <el-button type="primary" plain v-if="concatButtonFlag" style="margin-right:10px;" size="small" class="more"
        v-fast-click :disabled="processButStatus" @click="handleConcat">
        {{$t('dialog.conversation')}}
        <template v-if="messageCounts">
          ({{messageCounts}})
        </template>
      </el-button> -->
      <slot>
      </slot>
    </div>
    <!-- <p class="be-careful" v-if="titleTips">
      <tooltips :value="$t(titleTips)"></tooltips>
    </p> -->
    <g-dialog v-if="conversationFlag" :dialogConfig="dialogConfig" :isClose="true" @close="closeConversation"
      :isVisible="conversationFlag">
      <conversation slot="body" slot-scope="{height}" :dialogHeight="height" v-if="conversationFlag"
        :taskDetailId="taskDetailId">
      </conversation>
    </g-dialog>
  </div>
</template>

<script>
export default {
  name: 'edit-title',
  data () {
    return {
      concatButtonFlag: false,
      parentProcess: null,
      processButStatus: false,
      approval: '',
      conversationFlag: false,
      // '@互动消息'
      dialogConfig: {
        title: this.$t('dialog.conversation'),
        appendBody: false,
        center: true,
        top: '80px',
        width: '65%',
        span: '0.7'
      },
      carefulTipsWidth: 200,
      taskDetailId: null,
      messageCounts: 0
    };
  },
  components: {
    conversation (resolve) {
      require(['../../IMNotice/conversation/conversation.vue'], resolve);
    }
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    titleTips: {
      type: String,
      default: ''
    }
  },
  watch: {
    '$parent.processTaskInfo.taskId': {
      handler () {
        // this.websocketMessageCounts();
      },
      deep: true
    }
  },
  created () {
    if (this.$route.name === 'processApprovalPage') {
      const seeType = this.$route.query.seeType;
      const type = this.$base64.decode(this.$route.params.type);
      this.concatButtonFlag = this.$t(`button.${type}`) === this.title && seeType !== 'read';
      this.taskDetailId = Number(this.$base64.decode(this.$route.params.taskDetailId));
      // this.websocketMessageCounts();
    }
  },
  mounted () {
    // this.$nextTick(() => {
    //   const editTitle = this.$refs.editTitle;
    //   const titleTips = this.$refs.titleTips;
    //   const approvalTips = this.$refs.approvalTips;
    //   const editButton = this.$refs.editButton;
    //   const editTitleWidth = editTitle.offsetWidth; // 标题宽度
    //   const titleTipsWidth = titleTips.offsetWidth; // 文字宽度
    //   const approvalTipsWidth = approvalTips ? approvalTips.offsetWidth : 0; // approval文字宽度
    //   const editButtonWidth = editButton.offsetWidth;
    //   this.carefulTipsWidth = editTitleWidth - titleTipsWidth - approvalTipsWidth - editButtonWidth - 60;
    //   console.log(this.carefulTipsWidth, 'this.carefulTipsWidth');
    // });
  },
  methods: {
    // @互动
    handleConcat () {
      this.conversationFlag = true;
    },
    // 关闭弹出框
    closeConversation () {
      this.websocketMessageCounts();
      this.conversationFlag = false;
    },
    // 获取消息总数
    websocketMessageCounts () {
      if (!this.concatButtonFlag) return;
      if (!this.$parent.processTaskInfo.taskId) return;
      const data = {
        messageType: '01',
        taskId: this.$parent.processTaskInfo.taskId
      };
      this.$store.dispatch('publicApi/websocketMessageCounts', data).then(res => {
        this.messageCounts = res.results || 0;
      });
    }
  },
  updated () {
    if (this.approval) return;
    if (this.$parent.processTaskInfo && this.$parent.processTaskInfo.approval) {
      this.approval = this.$parent.processTaskInfo.approval;
    }
  }
};
</script>

<style scoped lang="scss">
.edit-title {
  width: 100%;
  height: 36px;
  border-bottom: 1px solid #eee;
  padding: 0 0px 8px 0;
  margin-bottom: 8px;
  // display: flex;
  .title {
    float: left;
    flex: auto;
    margin-right: 10px;
    line-height: 36px;
    font-size: 16px;
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    &:before {
      content: "";
      display: inline-block;
      height: 24px;
      position: absolute;
      top: 6px;
      border-left: 4px solid #009F3A;
    }
    span {
      float: left;
      &.titleTips {
        margin-left: 10px;
      }
    }
  }
  .be-careful {
    line-height: 15px;
    height: 30px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    position: relative;
    width: 80%;
    top: 8px;
    margin-left: 5px;
  }
  &.titleTips {
    height: 72px;
    .title {
      width: 100%;
    }
    .set {
      width: 100%;
      text-align: right;
      // position: relative;
      // top: 16px;
    }
  }
  .set {
    float: right;
    &.edit-title-set {
      display: flex;
    }
  }
  .approval {
    font-size: 14px;
    color: #ff4a4a;
  }
}
</style>
