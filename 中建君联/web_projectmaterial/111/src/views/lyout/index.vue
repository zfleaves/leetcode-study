<template>
  <div class="lyoutWrap"
    v-loading="contentLoading.status"
    :element-loading-text="contentLoading.text"
    :element-loading-background="contentLoading.bgcolor">
    <headNavigation>
    </headNavigation>
    <div class="content">
      <menuBar class="sidebar-container">
      </menuBar>
      <div class="constant"  v-if="isRouterAlive">
        <tag-nav class="tagNav">
        </tag-nav>
        <web-main class="main">
        </web-main>
      </div>
    </div>

    <!--token 失效的对话框-->
    <el-dialog
      :visible.sync="isToken"
      :show-close="false"
      :title="$t('login.tips')"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      top="35vh" width="30%">
      <div class="NoToken">
        <p>
          <i class="el-icon-warning"></i>
          <span>{{$t('login.isToken')}}</span>
        </p>
        <el-button type="primary" size="small" @click="changetoLogin">
         {{$t('login.logIn')}}
        </el-button>
      </div>
    </el-dialog>
    <g-dialog v-if="process_dialogFlag" :isClose="true" :isVisible="processFlag" @close="handleCloseProcessDialog">
      <monitorDialog slot="body">
      </monitorDialog>
    </g-dialog>
    <!-- 打印插件 -->
    <el-dialog
      :visible.sync="printFlag"
      v-if="printFlag"
      :title="$t('print.printPlugIn')"
      @close='handleClose'
      :close-on-click-modal="false"
      top="25vh" width="70%">
      <div style="height: 300px;padding: 40px;">
        <div style="padding: 40px;">
          <p style="line-height: 40px;" v-for="(item,index) in printStr" :key="index">
            <span style="color: #FF00FF">{{item.title}}</span>
            <el-button
              @click.stop="handleDownload(item)"
              type="text"
              size="small">
              {{item.tips}}
            </el-button>
          </p>
          <p style="line-height: 40px;">
            {{$t('print.restartBrowserAfterDownload')}}
          </p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import menuBar from './compoent/menuBar.vue';
  import webMain from './compoent/webMain.vue';
  import tagNav from '@/components/basicComponents/headNavigation/tabTagNav.vue';
  // import tagNav from './compoent/tagNav.vue';
  import Auth from 'util/auth';
  import Utils from 'util/index.js';

  export default {
    name: 'index',
    components: {
      menuBar, webMain, tagNav
    },
    provide () {
      return {
        reloadPage: this.reloadPage // 局部刷新
      };
    },
    data () {
      return {
        isRouterAlive: true,
        processFlag: false,
        printFlag: false
      };
    },
    computed: {
      isCollapse () {
        return this.$store.state.diaLog.sidebarOpen;
      },
      isToken () {
        return this.$store.state.user.overdueToken;
      },
      process_dialogFlag () {
        return this.$store.state.diaLog.process_dialogFlag;
      },
      contentLoading () {
        return this.$store.state.diaLog.contentLoading;
      },
      printStr() {
        return this.$store.state.diaLog.printStr;
      },
      tagNavList() {
        return this.$store.state.tagNav.cachedPageList;
      }
    },
    watch: {
      process_dialogFlag () {
        if (this.process_dialogFlag) {
          this.processFlag = true;
        } else {
          this.processFlag = false;
        }
      },
      printStr() {
        if (this.printStr.length) {
          this.printFlag = true;
        } else {
          this.printFlag = false;
        }
      }
    },
    methods: {
      // 刷新方法
      reloadPage () {
        this.isRouterAlive = false;
        // 该方法会在dom更新后执行
        this.$nextTick(function () {
          this.isRouterAlive = true;
        });
      },
      changetoLogin () {
        Utils.commonUtil.resetVuex(); // 清楚store数据
        Auth.reLogin();
        const url = `${this.$utils.config.jumpUrl}/portal/#/${Auth.hasLoginTitle()}`;
        window.open(url, '_self');
      },
      handleDownload(item) {
        const url = item.url;
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        document.body.appendChild(link);
        link.click();
        this.$message({
          message: this.$t('print.restartBrowserAfterDownload'),
          type: 'success'
        });
      },
      handleClose() {
        this.$store.commit('diaLog/SET_PRINT_STR');
        this.setPrintRoute('printDesign');
      },
      setPrintRoute(name) {
        const index = this.tagNavList.findIndex(v => v.name === name);
        if (index < 0) return;
        this.closeTheTag(this.tagNavList[index], index);
      },
      closeTheTag (item, index) {
        //  当关闭当前页面的Tag时，则自动加载前一个Tag所属的页面
        //  如果没有前一个Tag，则加载默认页面
        this.$store.commit('tagNav/removeTagNav', item);
        if (this.$route.meta.metaName === item.name) {
          if (index) {
            const iNOW = this.tagNavList.findIndex(v => v.name === this.lastRouterName);
            if (iNOW >= 0) {
              this.$router.push(`/${this.lastRouterName}`);
              const timestamp = (new Date()).getTime();
              const lastRoute = JSON.parse(JSON.stringify(this.tagNavList[iNOW]));
              lastRoute.setTime = timestamp;
              this.$store.commit('tagNav/SET_FRESHROUTE', lastRoute);
            } else {
              this.$router.push(this.tagNavList[index - 1].path);
            }
          } else {
            this.$router.push('/home');
          }
        }
      },
      // 关闭流程监控弹窗
      handleCloseProcessDialog () {
        this.$store.commit('diaLog/set_process_dialog');
      }
    }
  };
</script>

<style scoped lang="scss">
  .lyoutWrap {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .content {
      width: 100%;
      height: calc(100% - 50px);
      .sidebar-container {
        float: left;
        width: 200px;
        height: 100%;
        &.isCollapse {
          width: 64px;
        }
      }
      .constant {
        height: 100%;
        float: left;
        width: calc(100% - 200px);
        &.isCollapse {
          width: calc(100% - 64px);
        }
        .tagNav {
          height: 46px;
          width: 100%;
        }
        .main {
          width: 100%;
          padding: 10px 10px 10px 20px;
          box-sizing: border-box;
          height: calc(100% - 46px);
        }
      }
    }
  }

  .NoToken {
    padding: 40px;
    p {
      margin-bottom: 40px;
      color: red;
    }
  }
</style>
