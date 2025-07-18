<template>
  <div>
    <div class="header" @click="handleCloseMenu" @mousemove="handleCloseMenu">
      <div class="logo">
        <img :src="require('assets/images/A0logo02.svg')" alt="" width="150">
        <span class="logoText">{{ $t('login.headerTitle') }}</span>
      </div>

      <div class="header-left">
        <div class="public">
          <!-- 流程办理 -->
          <div class="exitLogon" @click="jumpPageProtal('task')">
            <span v-if="taskStatus > 0">
              <el-badge id="notice" :value="taskStatus" :max="99" class="item">
                {{$t('dialog.processHandle')}}
              </el-badge>
            </span>
            <span v-else>{{$t('dialog.processHandle')}}</span>
          </div>
          <!-- 任务办理-->
          <div class="exitLogon"   @click="jumpPageProtal('driveJob')">
            <span v-if="jobCounts > 0">
              <el-badge id="notice" :value="jobCounts" :max="99" class="item">
                {{$t('dialog.taskHand')}}
              </el-badge>
            </span>
            <span v-else  class="el-badge item">{{$t('dialog.taskHand')}}</span>
          </div>
          <!-- 预警提醒-->
          <div class="exitLogon" @click="jumpPageProtal('messageInteraction')">
            <span v-if="typeNewCount > 0">
              <el-badge
                id="notice"
                :value="typeNewCount"
                :max="99"
                class="item"
              >{{$t('dialog.warningReminder')}}
              </el-badge>
            </span>
            <span v-else>{{$t('dialog.warningReminder')}}</span>
          </div>
          <language v-show="false">
          </language>
          <div class="user-info-list" style="cursor: pointer; padding-left: 30px;position:relative;top:5px;">
            <el-popover placement="bottom" width="300" trigger="hover">
              <div slot="reference" style="cursor: pointer;display: flex;align-items: center;">
                <div class="reference-user-img">
                  <img style="max-width: 100%; max-height: 100%;" class="midFont"
                    :src="userHead ? userHead : require('assets/images/public/nav_user.png')">
                </div>
              </div>
              <div class="userInfo_list">
                <div class="user-info">
                  <div class="user-userHead">
                    <img style="max-width: 100%; max-height: 100%;" class="midFont"
                      :src="userHead ? userHead : require('assets/images/public/nav_user.png')">
                  </div>
                  <div class="user-infos">
                    <tooltips :value="userInfo.tenantName"></tooltips>
                    <span>{{userInfo.userName}}</span>
                  </div>
                </div>
                <div v-for="item in userInfoList" :key="item.callBack" class="list_li"
                  @click="jumpPageProtal(item.path)">
                  <i :class="item.icon"></i>
                  <p style="margin: 0 10px;">{{$t(`menu.${item.path}`)}}</p>
                </div>
                <div class="list_footer" @click="exitLogon">
                  <i class="el-icon-switch-button"></i>
                  <p>{{$t('dialog.exitTheSystem')}}</p>
                </div>
              </div>
            </el-popover>
          </div>
        </div>
      </div>
    </div>
    <el-dialog v-dialogDrag :visible.sync="dialogVisible" style="top:25%" width="30%">
      <div slot="title" class="out-header"><i class="el-icon-warning-outline"></i><span>{{$t('globalData.tips')}}</span>
      </div>
      <span
        style="line-height: 60px;margin-bottom: 60px;text-indent: 1em;display: flex;">{{$t('dialog.exitTheSystemTips')}}?</span>
      <span slot="footer" class="dialog-footer">
        <el-button v-fast-click icon="el-icon-circle-close" class="urgent" type="primary" size="small"
          @click="dialogVisible = false">{{$t('button.close')}}
        </el-button>
        <el-button size="small" v-fast-click icon="el-icon-circle-check" type="primary"
          @click="submitForm">{{$t('button.determine')}}
        </el-button>
      </span>
    </el-dialog>

    <transition name="el-zoom-in-top">
      <subsystemNavigation v-if="subsystemNavigationFlag" @close='subsystemNavigationFlag = false'>
      </subsystemNavigation>
    </transition>
    <transition name="fade-menuTransform">
      <menuNavigation v-if="menuNavigationFlag" @close='menuNavigationFlag = false'></menuNavigation>
    </transition>
    <!-- @mousemove="mousemoveMenuModal" -->
    <div class="menuModal" v-show="menuNavigationFlag" @click="mousemoveMenuModal"></div>

    <div class="navigationModal" v-show="subsystemNavigationFlag" @mousemove="subsystemNavigationFlag = false"
      @click="subsystemNavigationFlag = false"></div>
    <transition name="el-zoom-in-top">
      <useNavigation v-if="useNavigationFlag" @close='() => useNavigationFlag = false'></useNavigation>
    </transition>
    <div class="navigationModal" v-show="useNavigationFlag" @mousemove="useNavigationFlag = false"
      @click="useNavigationFlag = false"></div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Auth from 'util/auth';
import Utils from 'util/index.js';
import config from 'util/config';

export default {
  name: 'headNavigation',
  inject: ['reload'],
  data () {
    return {
      dialogVisible: false,
      userHead: '',
      userInfoList: [
        {
          name: '基本资料', icon: 'el-icon-user', path: 'personalInfo'
        },
        {
          name: '安全设置', icon: 'el-icon-lock', path: 'setSecurity'
        }
        // {
        //   name: '修改密码', icon: 'el-icon-office-building', path: 'authentication'
        // }
      ],
      types: '',
      userName: '',
      headPic: '',
      isProbation: 0,
      userInfo: {},
      taskStatus: 0,
      taskCenterTotal: 0,
      taskTimer: null,
      messageTimer: null,
      clickHanlder: null,
      closeHanlder: null,
      menuNavigationFlag: false,
      subsystemNavigationFlag: false,
      useNavigationFlag: false,
      time: 0,
      outTime: 0,
      timeout: 0,
      clickHanlderLeave: null,
      clickmouseout: null,
      routerList: [],
      toPath: '',
      jobCounts: 0,
      typeNewCount: 0
    };
  },
  components: {
    language (resolve) {
      require(['./language.vue'], resolve);
    },
    menuNavigation (resolve) {
      require(['./menuNavigation.vue'], resolve);
    },
    subsystemNavigation (resolve) {
      require(['./subsystemNavigation.vue'], resolve);
    },
    // IMNoticeItems(resolve) {
    //   require(['components/basicComponents/IMNotice/IMNoticeItems.vue'], resolve);
    // },
    useNavigation (resolve) {
      require(['./useNavigation.vue'], resolve);
    }
  },
  computed: {
    stateUserInfo () {
      return this.$store.state.user.userInfo;
    },
    tagNavList () {
      const cachedPageList = this.$store.state.tagNav.cachedPageList;
      for (const item of cachedPageList) {
        item.isClose = false;
        const translateType = item.translateType === 'info' ? 'detailsInfo' : item.translateType;
        this.$set(item, 'translateType', translateType);
      }
      return cachedPageList;
    },
    statusNotice () {
      return this.$store.state.diaLog.statusNotice;
    },
    isHeadPic () {
      return this.$store.state.user.isHeadPic;
    },
    getNewCountStatus() {
      return this.$store.state.diaLog.newCountStatus;
    }
  },
  watch: {
    isHeadPic () {
      this.handleSetUserInfo();
    },
    stateUserInfo: {
      handler () {
        this.userInfo = Auth.hasUserInfo();
        this.handleSetUserInfo();
      },
      deep: true
    },
    statusNotice () {
      if (this.statusNotice) {
        this.$store.commit('diaLog/set_status_notice', false);
        this._getStatus();
      }
    },
    $route (to, from) {
      // 当前子系统刷新页面并跳转到对应办理事项的列表角标还是需要重新获取
      if (from.name === 'processApprovalPage') {
        this._getStatus();
      }
    },
    getNewCountStatus: {
      handler() {
        if (this.getNewCountStatus) {
          this.getNewCount();
        }
      },
      immediate: true,
      deep: true
    }
  },
  created () {
    this.userInfo = Auth.hasUserInfo();
    this._getStatus();
    this._getStatusInterval();
  },
  mounted () {
    this.handleSetUserInfo();
  },
  methods: {
    ...mapActions({
      delAllViews: 'tagNav/delAllViews'
    }),
    // 跳转页面
    toPage () {
      this.$router.push('/home');
    },

    _getStatus () {
      this._getTaskList();
      this.getNewCount();
    },
    // 获取任务级消息状态延迟
    _getStatusInterval () {
      this.taskTimer = setInterval(() => {
        this._getTaskList();
        this.getNewCount();
      }, 60000);
    },
    // 获取任务状态
    _getTaskList () {
      this.$store.dispatch('publicApi/getTaskStatus').then(res => {
        if (res.status === 0) {
          this.taskStatus = res.results ? res.results > 99 ? 99 : res.results : 0;
        }
      });
      // 获取任务数量
      this.$store.dispatch('driveJob/getDriverJobOwnCounts', {handerStatus: '01'}).then(res => {
        if (res.status === 0) {
          this.jobCounts = res.results ? res.results > 99 ? 99 : res.results : 0;
        }
      });
    },
    // 获取预警消息个数
    getNewCount() {
      const data = {
        type: 8,
        userCode: this.$utils.Auth.hasUserInfo().userCode
      };
      this.$store.dispatch('messageInteraction/getNewCount', data).then(res => {
        if (res.status === 0) {
          this.typeNewCount = res.results ? res.results > 99 ? 99 : res.results : 0;
          this.$store.commit('diaLog/set_status_news', false);
        }
      });
    },
    handleSetUserInfo () {
      const userInfo = Auth.hasUserInfo();
      this.types = userInfo.types;
      this.userName = userInfo.userName;
      this.headPic = userInfo.headPic;
      // 1使用客户 0正式客户
      this.isProbation = userInfo.isProbation;
      if (!this.headPic) return;
      this._getFileDownloadList(this.headPic);
    },
    // 获取图片路径
    _getFileDownloadList (id) {
      if (!id) return;
      this.$store.dispatch('publicApi/getFilepath', { fileIds: [id] }).then(res => {
        if (res.status === 0 && res.results && res.results.length) {
          this.userHead = `${config.imageUrl}${res.results[0].filePath}`;
        }
      });
    },

    // 退出登录
    exitLogon () {
      const tips = `<div style="height: 60px; line-height: 60px;">${this.$t('dialog.exitTheSystemTips')}</div>`;
      this.$confirm(tips, this.$t('tips.tips'), {
        cancelButtonClass: 'button-close',
        dangerouslyUseHTMLString: true,
        confirmButtonText: this.$t('button.determine'),
        cancelButtonText: this.$t('button.close'),
        type: 'warning'
      }).then(() => {
        this.submitForm();
      }).catch(() => { });
      // this.dialogVisible = true;
    },
    submitForm () {
      const userInfo = Auth.hasUserInfo();
      this.$store.dispatch('publicApi/outLoginPublic', { token: userInfo.token, userId: userInfo.userId, domain: 'customer' }).then(res => {
        if (res.status === 0 && res.results) {
          Utils.commonUtil.resetVuex(); // 清楚store数据
          Auth.reLogin();
          this.jumpPageProtal(Auth.hasLoginTitle());
        }
      });
    },
    // 导航跳转到中台页面
    jumpPageProtal (page) {
      this.$router.push(`/${page}`);
    },
    handleCloseMenu () {
      this.menuNavigationFlag = false;
    },
    mousemoveMenuModal () {
      this.menuNavigationFlag = false;
    },
    mouseoverNavigation () {
      this.subsystemNavigationFlag = true;
      this.useNavigationFlag = false;
    },
    mouseLeaveNavigation () {
      this.subsystemNavigationFlag = false;
    },
    mouseoverUseNavigation () {
      this.useNavigationFlag = true;
      this.subsystemNavigationFlag = false;
    },
    mouseLeaveUseNavigation () {
    },
    jumpPath (path) {
      const url = `${config.jumpUrl}/#/${path}`;
      window.open(url, '_blank');
    }
  }
};
</script>

<style scoped lang="scss">
.autoWidth {
  min-width: 120px;   //设置最小的宽度
  text-align: start;  // 这里是个坑，由于我是在vue中挂载的页面，如果给app的样式设置了text-align：center后，这里是需要重新设置start 否则选择框内的内容是默认居中，会造成未选择内容和选择内容时样式不对
}
.autoWidth >>> .el-input__prefix {  // 这里直接时复制原来的input的样式，给.el-input__prefix加上
  position: relative;
  box-sizing: border-box;
  border: 1px solid #ffffff00;
  padding: 0 40px;
  height: 40px;
  line-height: 40px;
  color: #606266;
  left: 0;
  visibility: hidden;
}
.autoWidth >>> .el-input__inner {
  position: absolute;   //这里一定需要给，给内容进行定位
}
.menuModal {
  width: 100%;
  height: 100%;
  top: 60px;
  left: 200px;
  z-index: 1005;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 1;
}
.navigationModal {
  width: 100%;
  height: 100%;
  top: 60px;
  left: 0px;
  z-index: 1005;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 1;
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
.header {
  height: 60px;
  // background: #009F3A;
  background: #ffffff;
  // padding: 0 0 0 10px;
  width: 100%;
  line-height: 60px;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  // color: white;
  .logo {
    padding-left: 10px;
    box-sizing: border-box;
    img {
      position: relative;
      top: -3px;
      left: 8px;
      vertical-align: middle;
    }
    .logoText {
      margin-left: 15px;
      font-size: 28px;
      font-weight: 400;
      color: #333333;
      margin-left: 85px;
    }
  }
  .header-left {
    // width: calc(100% - 200px);
    flex: auto;
    // background: rgba(43, 116, 236, 1);
  }
  .menu {
    float: left;
    height: 60px;
    flex: auto;
    padding: 0 10px;
    display: flex;
    .router-list {
      display: flex;
      div {
        margin-left: 30px;
        font-size: 18px;
        cursor: pointer;
        // color: #333333;
      }
      // div:hover {
      //   color: #ff4a4a;
      // }
      .activePage{
        color: #ffa13a !important;
      }
    }
    p {
      font-weight: bold;
      font-size: 20px;
    }
    li {
      height: 100%;
      float: left;
      font-size: 12px;
      // color: white;
      // color: #000;
      cursor: pointer;
      margin: 0 20px;
      &.active {
        color: #009F3A;
      }
    }
  }
  .public {
    float: right;
    display: flex;
    height: 60px;
    padding-right: 20px;
    .exitLogon {
      font-size: 16px;
      cursor: pointer;
      // color: #333333;
      margin-left: 40px;
      cursor: pointer;
      position: relative;
      /deep/ .el-badge__content.is-fixed {
        top: 22px !important;
        right: 0 !important;
      }
      .imgHot {
        position: absolute;
        top: 11px;
        right: -20px;
      }
    }
    .reference-user-img {
      width: 32px;
      height: 32px;
      overflow: hidden;
      margin-top: 9px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      background: white;
    }
  }
}

.out-header {
  // color: white;
  color: #000;
  display: flex;
  align-items: center;
  span {
    font-size: 12px;
    margin-left: 5px;
    display: inline-block;
  }
}
.userInfo_list {
  width: 300px;
  .user-info {
    border-bottom: 1px solid #eeeeee;
    padding: 10px 20px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    .user-userHead {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      padding-right: 15px;
      display: flex;
      align-items: center;
    }
    .user-infos {
      flex: auto;
      line-height: 28px;
      overflow: hidden;
      div {
        font-size: 14px;
        color: black;
      }
    }
  }
  .list_li {
    display: inline-block;
    width: 100%;
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    align-items: center;
    i {
      font-size: 16px;
    }
  }
  .list_li:hover {
    background: #ebebeb;
  }
  .active {
    background: rgb(212, 235, 250);
    color: #009F3A;
    border-radius: 5px;
  }
  .list_footer {
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 40px;
    height: 40px;
    text-align: center;
    background: #fafafa;
    cursor: pointer;
    color: #ffa13a;
    margin-top: 15px;
  }
  .list_footer:hover {
    background: #eee;
  }
}
</style>
