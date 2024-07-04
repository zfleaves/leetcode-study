<template>
  <div class="menus menuLink">
    <div class="menusList" ref="menusList">
      <hamburger v-if="false" class="hamburger-container" :toggleClick="toggleSideBar" :isActive="flag">
      </hamburger>
      <el-menu
        class="menuslll"
        mode="vertical"
        :router="false"
        ref="elMenu"
        default-active="00"
        :unique-opened="true"
        background-color="#FAFAFA"
        text-color="#505599"
        active-text-color="#409EFF">
        <template v-for="(item,index) in permission_routers">
          <el-submenu :index="String(index)"
                      v-if="item.children && item.flg !=='2'" :key="index">
            <template slot="title">
              <i v-if="item.meta.icon" :class="'iconfont ' + item.icon"></i>
              <i v-else class="el-icon-wallet"></i>
              <span class="menu" :title="$t(`menu.${item.pathLanguage}`)">{{$t(`menu.${item.pathLanguage}`)}}</span>
            </template>
            <template v-for="(child,i) in item.children">
              <template>
                <el-menu-item-group :key="i">
                  <el-menu-item
                    @click="handleRouter(child)"
                    v-if="child.children"
                    :class="defaultUrl === '/'+child.path ? 'is-route-active' : 'is-route-close'"
                    :index="index+''+i">
                    <template slot="title">
                      <i v-if="child.meta.icon" :class="'iconfont ' + child.meta.icon"></i>
                      <i v-else class="el-icon-wallet"></i>
                      <span class="menu" :title="$t(`menu.${child.meta.pathLanguage}`)">
                        <tooltips
                          :value="$t(`menu.${child.meta.pathLanguage}`)">
                        </tooltips>
                      </span>
                    </template>
                  </el-menu-item>
                </el-menu-item-group>
              </template>
            </template>
          </el-submenu>
        </template>
      </el-menu>
    </div>
  </div>
</template>

<script>
  import Auth from 'util/auth';
  // import {generateTitle} from '@/i18n/translate'
  // import {getMenusTreeAllList} from "api/menuResources/menuResources";

  export default {
    components: {
      hamburger (resolve) {
        require(['./hamburger.vue'], resolve);
      }
    },
    computed: {
      isCollapse () {
        return this.$store.state.diaLog.sidebarOpen;
      }
    },
    data () {
      return {
        uniqueOpened: false,
        value: '',
        permission_routers: [],
        defaultUrl: '',
        flag: false,
        menuFlag: true
      };
    },
    created () {
      const getRouter = Auth.hasMenuRouter(); // 拿到路由
      this.setRouter(getRouter);
    },
    methods: {
      setRouter (arr) {
        if (arr.length === 0) return;
        this.permission_routers = JSON.parse(JSON.stringify(arr));
        this.getPath();
      },
      // generateTitle,
      getPath () {
        this.defaultUrl = this.$route.path;
      },
      toggleSideBar () {
        this.flag = !this.flag;
        this.$store.commit('diaLog/SET_SLIDEBAROPEN', this.flag);
      },
      // 路由跳转
      handleRouter (item) {
        this.$router.push(`/${item.path}`);
      }
    },
    watch: {
      '$route': 'getPath'
    },
    mounted () {
      const userInfo = Auth.hasUserInfo() || '';
      this.value = userInfo.companyFullName;
      this.getPath();
    }
  };
</script>
<style lang="scss" scoped>
  .menus {
    background: #f5f5f5;
    position: relative;
    .tooltip{
      // padding-right: 10px;
      box-sizing: border-box;
    }
    .logo {
      width: 100%;
      height: 50px;
      padding: 0 5px;
      box-sizing: border-box;
      position: absolute;
      top: 0;
      line-height: 50px;
      text-align: center;
      color: white;
      background-color: rgb(48, 65, 86);
    }
    .menusList {
      width: 100%;
      height: 100%;
      position: relative;
      .menuslll {
        position: absolute;
        // top: 40px;
        top: 0px;
        width: 100%;
        box-sizing: border-box;
        overflow-y: auto;
        bottom: 0;
        &::-webkit-scrollbar {
          display: none;
        }
      }
    }
    .setClose {
      position: absolute;
      top: 50%;
      right: -32px;
      z-index: 99;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      i {
        font-size: 20px;
      }
    }
  }
</style>
