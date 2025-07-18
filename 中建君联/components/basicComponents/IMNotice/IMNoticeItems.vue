<!--
 * @Author: your name
 * @Date: 2021-12-03 09:39:44
 * @LastEditTime: 2022-05-31 14:59:43
 * @LastEditors: zengqin 1058574586@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \web_portal\src\components\global\IMNotice\IMNoticeItems.vue
-->
<template>
  <div>
    <audio id='audioPlay' controls="controls" src='../images/dingdong.wav' v-show="false"></audio>
    <el-popover popper-class="notice-popover" placement="bottom" :width="messageTotal > 0 ? 420 : 260" trigger="hover">
      <div slot="reference">
        <!-- <el-badge
          v-if="messageTotal > 0"
          id="notice"
          :value="messageTotal"
          :max="100"
          class="item"
        >
          <span>
            {{$t('dialog.messageReminder')}}
            </span>
        </el-badge> -->
        <span>{{ $t("dialog.IMNotice") }}</span>
        <span v-if="messageTotal" class="status-notice"></span>
      </div>
      <div class="notice-items">
        <div v-if="messageTotal > 0" class="items-list">
          <div class="items-info" v-for="item in todoList" :key="`${item.messageType}-${item.sessionId}`"
            @click="handleItemsInfo(item)">
            <div class="items-userHead">
              <span :class="'iconBackColor-' + item.messageType">
                {{item.messageTypeValueTitle}}
              </span>
            </div>
            <div class="items-infos">
              <span class="items-name">{{ item.messageTypeValue }}</span>
              <span class="
                  el-badge__content el-badge__content--undefined
                  items-name-status
                ">{{ item.num }}</span>
              <div style="width: 300px" class="ellipsis">
                <!-- 您有新的 -->
                <!-- 请及时处理 -->
                <el-tooltip class="item" effect="dark" :content="item.taskName" placement="top-start">
                  <span>{{
                    item.taskName
                  }}</span>
                </el-tooltip>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="items-list">
          <div class="items-info">
            <!-- 暂无未读消息 -->
            {{$t('dialog.noUnreadMessage')}}
          </div>
        </div>
        <div class="notice-buts">
          <!-- 查看全部未读消息 -->
          <el-button size="small" type="text" @click="handleAll">{{
            $t("dialog.viewAllUnread")
          }}</el-button>
          <el-tooltip class="item" effect="dark"
            :content="$t(`tips.${messageReminder==='open' ? 'messageReminderOpenTips' : 'messageReminderCloseTips'}`)"
            placement="bottom">
            <!-- 消息 -->
            <i :class="messageReminder==='open' ? 'el-icon-bell open' : 'el-icon-close-notification close'"
              @click="hanleMessageReminder('set')"></i>
          </el-tooltip>
        </div>
      </div>
    </el-popover>
  </div>
</template>
<script>
import config from 'util/config.js';
import { webSocketMixins } from 'mixins/webSocketMixins';

export default {
  name: 'IMNoticeItems',
  mixins: [webSocketMixins],
  data () {
    return {
      config,
      todoList: [],
      messageTotal: 0 // 消息总数
    };
  },
  created () {
    this.hanleMessageReminder();
    this.websocketTodoList();
  },
  methods: {
    // 获取待处理消息类型
    websocketTodoList () {
      const userId = this.$utils.Auth.hasUserInfo().userId;
      this.$store.dispatch('task/websocketTodoMessagePage', { receiverUserId: userId, pageNo: 1, pageSize: 5, messageStatus: '02' }).then(res => {
        if (res.status === 0) {
          this.todoList = [];
          this.messageTotal = 0;
          const messageTitleList = {
            '01': this.$t('tips.news'),
            '02': this.$t('tips.do'),
            '03': this.$t('tips.read'),
            '04': this.$t('tips.warn'),
            '05': this.$t('tips.let'),
            '06': this.$t('tips.governor')
          };
          const results = res.results.records;
          // 消息类型(01流程中聊天消息,02待办消息,03待阅消息)
          for (const item of results) {
            if (item.messageType) {
              this.todoList.push({
                messageTypeValueTitle: messageTitleList[item.messageType],
                sendMessageId: (item.details.length && item.details[0].sendMessageId) || null,
                messageType: item.messageType,
                taskName: item.taskName,
                taskId: item.taskId,
                formCode: item.formCode,
                sessionId: item.sessionId,
                messageTypeValue: this.messageTypeList[item.messageType],
                num: item.details.length || 1,
                details: item.details,
                messageSequence: Math.max(...item.details.map(v => v.messageSequence)),
                taskDetailId: Math.max(...item.details.map(v => v.taskDetailId))
              });
            }
          }
          this.messageTotal = res.results.total;
        } else {
          this.$message.error(`${res.errorMessage}`);
        }
      });
    },
    // 查看全部
    handleAll () {
      const href = `${config.jumpUrl}/#/messageInteraction`;
      window.open(href, '_blank');
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .el-badge__content.is-fixed {
  top: 22px !important;
}
.items-list {
  background: #fafafa;
}
.status-notice {
  width: 5px;
  height: 5px;
  display: inline-block;
  border-radius: 50%;
  background: #ff4a4a;
  position: absolute;
  top: 26px;
  right: -8px;
}
.notice-items {
  .items-info {
    position: relative;
    cursor: pointer;
    border-bottom: 1px solid #eeeeee;
    padding: 10px 20px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    .items-userHead {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      padding-right: 15px;
      display: flex;
      align-items: center;
      span {
        font-size: 21px;
        color: white;
        text-align: center;
        width: 36px;
        height: 36px;
        line-height: 36px;
        border-radius: 50%;
      }
      .iconBackColor-01 {
        background: #0089f0;
      }
      .iconBackColor-02 {
        background: #f38900;
      }
      .iconBackColor-03 {
        background: #64b524;
      }
      .iconBackColor-04 {
        background: #ffa13a;
      }
      .iconBackColor-05 {
        background: #0089f0;
      }
      .iconBackColor-06 {
        background: #ffa13a;
      }
    }
    .items-infos {
      flex: auto;
      line-height: 28px;
      overflow: hidden;
      div {
        font-size: 14px;
        color: black;
      }
      .items-name {
        position: relative;
      }
      .items-name-status {
        position: absolute;
        right: 20px;
        top: 15px;
      }
    }
  }
}
.notice-buts {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 5px 20px;
  box-sizing: border-box;
  i {
    font-size: 20px;
    line-height: 34px;
  }
  .open {
    color: #009F3A;
  }
  .close {
    color: gray;
  }
}
@-webkit-keyframes twinkling {
  0% {
    opacity: 0;
  }
  20% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  20% {
    opacity: 0;
  }
  0% {
    opacity: 0;
  }
}

#notice {
  -webkit-animation: twinkling 1s infinite;
}
</style>
