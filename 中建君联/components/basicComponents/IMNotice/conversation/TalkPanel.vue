<template>
  <div>
    <el-container class="ov-hidden full-height">
      <!-- 主体信息 -->
      <el-main class="main-box no-padding">
        <div id="lumenChatPanel" class="talks-container lum-scrollbar" @scroll="handleScroll($event)">
          <!-- 数据加载状态栏 -->
          <div class="loading-toolbar">
            <span v-if="loadRecord.status == 0" class="color-blue">
              <i class="el-icon-loading" /> 正在加载数据中...
            </span>
            <span v-else-if="loadRecord.status == 1" class="pointer color-blue" @click="loadChatRecords">
              <i class="el-icon-bottom" /> 查看更多消息...
            </span>
            <span v-else> 没有更多消息了... </span>
          </div>

          <!-- 消息主体 -->
          <div v-for="item in records" :key="`${item.taskDetailId}-${item.messageSequence}`">
            <!-- 其它对话消息 -->
            <div class="message-box record-box" :class="{
                'direction-rt': item.float == 'right',
              }">
              <div class="avatar-column">
                <el-avatar class="pointer" :size="30" v-if="item.sendHeadPicUrl" :src="item.sendHeadPicUrl"></el-avatar>
                <el-avatar v-else class="pointer" :size="30" icon="el-icon-user-solid"></el-avatar>
              </div>
              <main class="main-column">
                <div class="talk-title">
                  <span v-show="item.float == 'right'" class="time">
                    <i class="el-icon-time" />
                    {{ parseTime(item.createTime, "{m}月{d}日 {h}:{i}") }}
                  </span>
                </div>

                <div class="talk-content">
                  <span v-show="item.float == 'left'" class="nickname">
                    {{ item.sendUserName }} |
                    {{ parseTime(item.createTime, "{m}月{d}日 {h}:{i}") }}
                  </span>
                  <!-- 文本消息 -->
                  <!-- v-if="!item.attachmentId" -->
                  <text-message :content="item.messageContent" :attachmentId="item.attachmentId"
                    :receiverUsers="item.receiverUsers" :float="item.float" :full-width="false" :arrow="true"
                    @attachmentSee="attachmentSee" />
                </div>
              </main>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
    <!-- 附件弹框 -->
    <el-dialog v-dialogDrag class="el-dialog-auto" :title="$t('tips.fileList')" append-to-body v-if="dialogGridData"
      :visible.sync="dialogGridData" width="70%">
      <attachment v-if="dialogGridData" :gridData="gridData" :isEdit="false">
      </attachment>
    </el-dialog>
  </div>
</template>
<script>
import filtersFn from 'mixins/filters/index';

export default {
  name: 'TalkPanel',
  props: {
    // 对话相关参数
    params: {
      type: Object,
      default () {
        return {
          // 消息类型
          messageType: '01',
          // 会话Id
          taskId: null
        };
      }
    }
  },
  components: {
    TextMessage (resolve) {
      require(['../messaege/TextMessage.vue'], resolve);
    },
    attachment (resolve) {
      require(['../../global/upload/attachment.vue'], resolve);
    }
  },
  data () {
    return {
      parseTime: filtersFn.parseTime,
      // 记录加载相关参数
      loadRecord: {
        status: 0,
        minRecord: 0
      },

      // 聊天记录管理器数据
      findChatRecord: false,

      // 置底按钮是否显示
      tipsBoard: false,
      uid: this.$utils.Auth.hasUserInfo().userId,

      records: [],
      unreadMessage: [],
      index_name: '',
      pages: 0,
      total: 0,
      pageNo: 1,
      pageSize: 10,
      gridData: [],
      dialogGridData: false
    };
  },
  watch: {
    params: {
      handler () {
        this.loadChatRecords();
      },
      deep: true
    }
  },
  mounted () {
    this.loadChatRecords();
  },
  methods: {
    // 添加最新通知
    setLoadChatRecords (row) {
      this._getSingleLogoDownloadList(row, row.sendHeadPic, () => {
        row.createTime = this.$utils.commonUtil.formatTime(new Date());
        const sendUserId = row.sendUserId ? row.sendUserId : this.uid;
        this.$set(row, 'messageContent', row.messageContent || row.content);
        this.$set(row, 'messageType', '01');
        this.$set(row, 'sendUserId', sendUserId);
        this.$set(row, 'float', sendUserId === this.uid ? 'right' : 'left');
        this.records.push(row);
      });
    },
    // 加载用户聊天详情信息
    loadChatRecords () {
      if (!this.params.taskId) return;
      if ((this.pageNo !== 1) && (this.pageNo > this.pages)) {
        return;
      }
      const userId = this.uid;
      const data = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        ...this.params
      };

      this.loadRecord.status = 0;
      const el = document.getElementById('lumenChatPanel');
      const scrollHeight = el.scrollHeight;

      this.$store
        .dispatch('publicApi/websocketReceiverMessagePage', data)
        .then(res => {
          const results = res.results;
          // 防止点击切换过快消息返回延迟，导致信息错误
          if (res.status === 1) {
            return;
          }
          const headPicFileIds = {};
          const headPicFileIdList = [];
          const records = results.records.map((item, index) => {
            item.float = 'center';
            if (item.sendUserId) {
              item.float = item.sendUserId === userId ? 'right' : 'left';
            }
            if (!headPicFileIds[item.sendUserId] && item.sendHeadPic) {
              this.$set(headPicFileIds, item.sendUserId, item.sendHeadPic);
              headPicFileIdList.push(item.sendHeadPic);
            }
            return item;
          });
          const listReverse = records.reverse();
          if (this.pageNo === 1) {
            this.records = listReverse;
          } else {
            this.records = [
              ...listReverse,
              ...this.records
            ];
          }
          this.total = results.total;
          this.pages = results.pages;
          headPicFileIdList.length && this._getLogoDownloadList(headPicFileIdList);
          this.loadRecord.status = results.total === 0 ? 2 : records.length > results.total ? 1 : 2;
          this.$nextTick(() => {
            if (records.length === 0) {
              el.scrollTop = el.scrollHeight;
            } else {
              el.scrollTop = el.scrollHeight - scrollHeight;
            }
            ++this.pageNo;
          });
        })
        .catch(() => {
          this.loadRecord.status = 1;
        });
    },
    // 获取头像
    _getLogoDownloadList (headPicFileIdList) {
        if (headPicFileIdList && headPicFileIdList.length) {
          this.$store.dispatch('publicApi/getFilepath', { fileIds: headPicFileIdList }).then(res => {
            for (const item of this.records) {
              // eslint-disable-next-line eqeqeq
              const index = res.results.findIndex(v => v.id == item.sendHeadPic);
              if (index >= 0) {
                this.$set(item, 'sendHeadPicUrl', `${this.$utils.config.imageUrl}${res.results[index].filePath}`);
              }
            }
          });
        }
    },
    // 获取单个头像
    _getSingleLogoDownloadList (row, headPic, callback) {
      if (!headPic) {
        callback && callback();
        return;
      }
      this.$store.dispatch('publicApi/getFilepath', { fileIds: [headPic] }).then(res => {
        this.$set(row, 'sendHeadPicUrl', `${this.$utils.config.imageUrl}${res.results[0].filePath}`);
        callback && callback();
      });
    },
    // 滚动事件监听
    handleScroll () {
      // 是否滚动到底部的判断
      const element = document.getElementById('lumenChatPanel');
      if ((element.scrollTop + element.clientHeight) === element.offsetHeight) {
        if (this.pageNo <= this.pages) {
          this.loadChatRecords();
        }
      }
    },
    // 查看附件
    attachmentSee (attachmentId) {
      this.getGridData(attachmentId);
    },
    // 获取文件
    getGridData (attachmentId) {
      if (attachmentId) {
        const attachmentIdList = attachmentId.split(',');
        const params = {
          fileIds: attachmentIdList
        };
        this.$store.dispatch('publicApi/getFilepath', params).then(res => {
          if (!res.results.length) return;
          this.gridData = res.results;
          this.dialogGridData = true;
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.main-box {
  position: relative;
}
.full-height {
  height: 100%;
}

.ov-hidden {
  overflow: hidden;
}
.no-padding {
  padding: 0;
}
/* 面板页脚 */
.footer-box {
  height: 160px !important;
  padding: 0;
  border-top: 1px solid #f5f5f5;
}

/* 侧边栏css */
.sidebar-box {
  position: absolute;
  width: 350px;
  height: 100%;
  top: 0px;
  right: -350px;
  z-index: 1;
  background: white;
  transition: all 0.5s ease-in-out;
  -moz-transition: all 0.5s ease-in-out;
  -webkit-transition: all 0.5s ease-in-out;
  -o-transition: all 0.5s ease-in-out;

  &.show {
    right: 0;
    box-shadow: 0 0 14px #e2e1e1;
  }
}

.tips-board {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  bottom: 20px;
  height: 30px;
  width: 100px;
  border-radius: 20px;
  font-size: 12px;
  background-color: #fff;
  box-shadow: 0 2.5px 10px 0 rgba(31, 35, 41, 0.1);
  color: #1f2329;

  span {
    margin-left: 5px;
    margin-top: -2px;
  }

  .svg {
    width: 10px;
    height: 10px;
    color: black;
  }
}

.talk-bubble {
  position: absolute;
  left: 0px;
  bottom: 20px;
  max-width: 300px;
  height: 40px;
  line-height: 40px;
  border-radius: 0 20px 20px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: white;
  padding: 0 15px 0 30px;
  font-size: 13px;
  background: #009F3A;

  i {
    font-size: 22px;
    position: absolute;
    left: 5px;
    top: 9px;
  }
}
// 滚动条样式
.lum-scrollbar {
  &::-webkit-scrollbar {
    width: 3px;
    background-color: #e4e4e5;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background-color: #c0bebc;
  }
}
.talks-container {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: 10px 15px 30px;
  overflow-y: auto;

  .message-box {
    width: 100%;
    min-height: 30px;
    margin-bottom: 5px;
  }

  .loading-toolbar {
    height: 30px;
    line-height: 30px;
    margin: 5px 0;
    text-align: center;
    user-select: none;
    font-size: 13px;
    color: #cec4c4;

    .color-blue {
      color: #009F3A;
    }
  }

  .datetime {
    height: 30px;
    line-height: 30px;
    color: #ccc9c9;
    font-size: 12px;
    text-align: center;
    margin: 5px 0;
  }

  .record-box {
    display: flex;
    flex-direction: row;
    transition: 0.5s ease;

    .checkbox-column {
      display: flex;
      justify-content: center;
      flex-basis: 40px;
      flex-shrink: 0;
      order: 1;
      user-select: none;
      padding-top: 25px;

      i {
        color: #ccc;
        cursor: pointer;
        font-size: 22px;
        &.selected {
          color: #009F3A !important;
        }
      }
    }

    .avatar-column {
      width: 40px;
      flex-basis: 40px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      order: 2;
      user-select: none;
      padding-top: 22px;
      flex-direction: column;
    }

    .main-column {
      flex: 1 auto;
      order: 3;
      position: relative;
      box-sizing: border-box;
      padding: 5px;
      overflow: hidden;

      .talk-title {
        display: flex;
        align-items: center;
        height: 15px;
        margin-bottom: 2px;
        font-size: 10px;
        user-select: none;
        color: #a7a0a0;
        opacity: 0;
        transition: 0.5s ease;

        &.show {
          opacity: 1 !important;
        }

        span {
          transform: scale(0.9);
        }
      }

      .talk-content {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        box-sizing: border-box;
        width: 100%;

        .nickname {
          font-size: 12px;
          color: #a7a0a0;
          margin: -4px 0 4px -8px;
          transform: scale(0.9);
        }
      }

      &:hover {
        .talk-title {
          opacity: 1;
        }
      }
    }

    &.direction-rt {
      .avatar-column {
        order: 3;
      }

      .main-column {
        order: 2;

        .talk-title {
          justify-content: flex-end;
        }

        .talk-content {
          align-items: flex-end;
        }
      }
    }

    &.checkbox-border {
      border: 1px dashed #c4c4ec;
      &:hover {
        border-color: #009F3A;
      }
    }
  }
}
</style>
