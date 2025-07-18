
<template>
  <div class="subsystemNavigation">
    <!-- <div class="model" @click="handleClose" @mousemove="handleClose"></div> -->
    <div class="subsystemNavigation-cons">
      <div class="title">
        {{ $t("dialog.subsystemNavigation") }}
        <i class="el-dialog__close el-icon el-icon-close" @click="handleClose"></i>
      </div>
      <!-- 有子系统 -->
      <div class="menu-content" v-loading="openCloudLoading">
        <div class="menu-content-fix menu-content-fix-con" v-if='!permission_subSystem.length'>
          <div class="noSubSystem">
            <div class="noSubSystem_img">
              <img src="../images/warning.png" alt="">
            </div>
            <!-- 系统监测到您还未设置过自己的功能导航，请先初始化！ -->
            <p class="large grey">{{$t('dialog.noMenuPleaseInit')}} </p>
            <!-- 初始化功能导航 -->
            <p class="large set" @click="handleMenuInit" v-fast-click>{{$t('dialog.initMenu')}}</p>
          </div>
        </div>
        <div class="menu-content-fix" v-else>
          <div class="menu-first" v-for="item in permission_subSystem" :key="item.id">
            <h4 class="ellipsis">
              <i :class="'iconfont ' + item.subSystemTypeIcon"></i>
              <tooltips :value="$t(`subSystemType.${item.subSystemTypeCode}`)"
                :title="$t(`subSystemType.${item.subSystemTypeCode}`)"></tooltips>
            </h4>
            <div class="child-menu" v-for="child in item.tenantSysSubSystems" :key="child.id">
              <p class="ellipsis" @click="jumpSysSubSystem(child)">
                <i :class="'iconfont ' + child.icon"></i>
                <tooltips :value="$t(`subSystem.${child.subSystemCode}`)"
                  :title="$t(`subSystem.${child.subSystemCode}`)"></tooltips>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="botton">
        <div class="botton-list">
          <!-- 我要设置我的子系统导航 -->
          <span class="smallFont grey">{{
            $t("dialog.subsystemNavigationTips1")
          }}</span>
          <p class="smallFont set" @click="handleSetSubsystemNavigation">
            {{ $t("button.click") }}
          </p>
        </div>
        <div class="botton-list">
          <!-- 我要返回第一个大首页 -->
          <span class="smallFont grey">{{
            $t("dialog.subsystemNavigationTips2")
          }}</span>
          <p class="smallFont set" @click="handleCloseHome">
            {{ $t("button.click") }}
          </p>
        </div>
      </div>
    </div>
    <!-- 选择已开通云产品 -->
    <el-dialog v-dialogDrag append-to-body :title="$t('dialog.openCloud')" center width="70%" top="5vh"
      :visible.sync="openCloudDialog">
      <openCloud v-if="openCloudDialog" @selectedOpenCloud="selectedOpenCloud">
      </openCloud>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'subsystemNavigation',
  data () {
    return {
      permission_subSystem: [],
      openCloudDialog: false,
      openCloudLoading: false,
      subsystemcodesList: [],
      effectiveSystem: [],
      fastLoading: null
    };
  },
  components: {
    openCloud (resolve) {
      require(['./openCloud.vue'], resolve);
    }
  },
  created () {
    this.getOpenCloudList();
  },
  methods: {
    // 获取租户已开通的云产品
    getOpenCloudList () {
      this.openCloudLoading = true;
      this.$store.dispatch('publicApi/getQuickSubsystemPublic').then(res => {
        if (res.results.length === 0) {
          this.openCloudLoading = false;
          // this.$store
          //   .dispatch('publicApi/getTenantSubSystemEffectivePublic', { currentTenantId: this.$utils.Auth.hasUserInfo().tenantId })
          //   .then(val => {
          //     this.permission_subSystem = val.results;
          //     this.openCloudLoading = false;
          //   })
          //   .catch(e => {
          //     this.openCloudLoading = false;
          //   });
        } else {
          const arr = [];
          if (!res.results || res.results.length === 0) {
            this.permission_subSystem = arr;
            this.openCloudLoading = false;
            return;
          }
          const sortArr = res.results.sort((a, b) => {
            return a.sort - b.sort;
          });
          for (const item of sortArr) {
            if (item.status === 0) {
              const index = arr.findIndex(v => v.subSystemTypeCode === item.subSystemTypeCode);
              if (index >= 0) {
                arr[index].tenantSysSubSystems.push(item);
              } else {
                arr.push({
                  subSystemTypeCode: item.subSystemTypeCode,
                  subSystemTypeName: item.subSystemTypeName,
                  subSystemTypeIcon: item.subSystemTypeIcon,
                  tenantSysSubSystems: [item]
                });
              }
            }
          }
          this.permission_subSystem = arr;
          this.openCloudLoading = false;
        }
      })
        .catch(e => {
          this.openCloudLoading = false;
        });
    },
    handleClose () {
      this.$emit('close');
    },
    // 跳转
    jumpSysSubSystem (row) {
      if (row.subSystemCode === this.$utils.config.subSystemCode) {
        this.$message.info(this.$t('dialog.alreadyIn'));
        return;
      }
      this.$store.dispatch('publicApi/checkSubSystemMenusPublic', { subSystemCode: row.subSystemCode }).then(res => {
        if (res.results) {
          this.handleClose();
          const url = `${this.$utils.config.jumpUrl}${row.url}`;
          window.open(url, '_blank');
        } else {
          // 您没有此子系统权限，请联系管理员授权
          this.$message.warning(this.$t('dialog.noPermission'));
        }
      });
    },
    // 我要设置我的子系统导航
    handleSetSubsystemNavigation () {
      this.openCloudDialog = true;
    },
    // 我要返回第一个大首页
    handleCloseHome () {
      const url = `${this.$utils.config.jumpUrl}/#/home`;
      window.open(url, '_self');
    },
    selectedOpenCloud () {
      this.openCloudDialog = false;
      this.getOpenCloudList();
    },
    // 初始化按钮
    handleMenuInit () {
      // 正在按照系统管理员为您设置的菜单权限进行功能导航区的初始化，请等待......
      this.fastLoading = this.$loading({
        lock: true,
        text: this.$t('dialog.waitInitMenu'),
        target: document.querySelector('.menu-content')
      });
      const params = {
        currentUserId: this.$utils.Auth.hasUserInfo().userId,
        tenantId: this.$utils.Auth.hasUserInfo().tenantId
      };
      this.$store.dispatch('publicApi/getUserAuthSubsystemCodes', params).then(res => {
        if (res.status === 0) {
          if (!res.results || !res.results.length) {
            // 你还没有子系统权限，请联系管理员
            this.fastLoading.close();
            return this.$message.warning(this.$t('dialog.noPermissionSubsystem'));
          }
          this.subsystemcodesList = res.results || [];
          this._getEffectiveSubsystem();
        } else {
          this.$message.error(this.$t(`exception.${res.errorCode}`));
        }
      });
    },
    _getEffectiveSubsystem () {
      this.$store.dispatch('publicApi/getEffectiveSubsystem', this.subsystemcodesList).then(res => {
        if (res.status === 0) {
          if (!res.results || !res.results.length) {
            // 你还没有子系统权限，请联系管理员
            this.fastLoading.close();
            return this.$message.warning(this.$t('dialog.noPermissionSubsystem'));
          }
          this.effectiveSystem = res.results || [];
          // console.log(this.effectiveSystem, 'this.effectiveSystem');
          this.addJurisdictionTree();
        } else {
          this.$message.error(this.$t(`exception.${res.errorCode}`));
        }
      });
    },
    // 保存快捷菜单
    addJurisdictionTree () {
      const subsystemList = [];
      for (const list of this.effectiveSystem) {
        if (list.tenantSysSubSystems && list.tenantSysSubSystems.length) {
          list.tenantSysSubSystems.forEach(item => {
            subsystemList.push(item);
          });
        }
      }
      const subsystemIds = subsystemList.map(v => v.id);
      this.$store.dispatch('publicApi/setQuickSubsystemPublic', subsystemIds).then(res => {
        if (res.status === 0) {
          // 子系统设置成功
          this.fastLoading.close();
          this.getOpenCloudList();
          this.$message.success(this.$t('dialog.selectSubsystemSuccess'));
        } else {
          this.fastLoading.close();
          this.$message.error(`${this.$t(`exception.${res.errorCode}`)}`);
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
@import url("//at.alicdn.com/t/font_1917819_44v9umzji6g.css");
@import url("//at.alicdn.com/t/font_2375226_xqu8w32bc5s.css");
.subsystemNavigation {
  position: fixed;
  // width: calc(100%);
  // width: calc(100% - 40%);
  width: 900px;
  // left: 55px;
  top: 80px;
  right: 30px;
  max-height: calc(100% - 80px);
  overflow: hidden;
  z-index: 1100;
  padding: 0 30px;
  background: white;
  // margin-left: 35%;
  .model {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 1;
    z-index: 990;
  }
  .subsystemNavigation-cons {
    max-height: 100%;
    position: relative;
    // width: calc(100% - 40%);
    // margin-left: 35%;
    width: 100%;
    // left: 55px;
    // box-sizing: border-box;
    background: white;
    z-index: 995;
    .title {
      height: 46px;
      line-height: 46px;
      border-bottom: 1px solid rgb(222, 222, 222);
      box-sizing: border-box;
      color: #333333;
      font-weight: bold;
      font-size: 14px;
      i {
        float: right;
        font-size: 20px;
        position: relative;
        cursor: pointer;
        top: 10px;
      }
    }
    .menu-content {
      max-height: calc(100% - 90px);
      width: 100%;
      // width: 500px;
      position: relative;
      overflow: hidden;
      min-height: 300px;
      overflow-x: auto;
      overflow-y: auto;
      .menu-content-fix {
        // position: absolute;
        // left: 0;
        // top: 0;
        // right: 0;
        // bottom: 0;
        // overflow-x: scroll;
        // width: 300%;
        // &::-webkit-scrollbar {
        //   display: none;
        // }
        display: flex;
        flex-direction: row; //横向排列
      }
      .menu-content-fix-con {
        width: 100%;
        min-height: 300px;
        display: flex;
        justify-content: center;
        align-items: center;
        .noSubSystem {
          display: flex;
          .noSubSystem_img {
            width: 35px;
            height: 35px;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
              width: 30px;
              height: 30px;
              vertical-align: middle;
            }
          }
          p {
            margin-left: 0px;
            font-size: 14px;
            height: 35px;
            line-height: 35px;
            &:nth-of-type(2) {
              cursor: pointer;
            }
          }
        }
      }
      .menu-first {
        width: 130px;
        overflow: hidden;
        // float: left;
        margin-right: 20px;
        flex-shrink: 0;
        h4 {
          color: rgb(255, 115, 15);
          font-size: 14px;
          font-weight: bold;
          margin: 20px 0;
          height: 20px;
          display: flex;
          i {
            margin-right: 8px;
          }
          span {
            display: block;
            width: calc(100% - 24px);
            height: 100%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
      .child-menu {
        margin-bottom: 15px;
        font-size: 14px;
        color: #666666;
        width: 100%;
        cursor: pointer;
        height: 24px;
        line-height: 24px;
        p {
          display: flex;
        }
        i {
          margin-right: 8px;
        }
        span {
          display: block;
          width: calc(100% - 24px);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        &:hover {
          // background: rgb(237,245,255);
          color: #009F3A;
        }
      }
    }
    .botton {
      left: 32px;
      margin-top: 10px;
      padding-bottom: 10px;
      position: relative;
      left: -8px;
      .botton-list {
        margin: 10px;
        width: 240px;
        display: flex;
        justify-content: space-between;
      }
    }
  }
}
</style>
