
<template>
  <div class="menuNavigation">
    <!-- <div class="model" @click="handleClose" @mousemove="handleClose"></div> -->
    <!-- <transition name="fade-transform"> -->
    <div class="menuNavigation-cons" v-if="isShow">
      <div class="title">
        {{$t('fConfig.menuNavigation')}}
        <i class="el-dialog__close el-icon el-icon-close" @click="handleClose"></i>
      </div>
      <div class="menu-content">
        <div class="menu-content-fix">
          <div class="menu-first" v-for="item in permission_routers" :key="item.id">
            <h4 style="display: flex;">
              <i v-if="item.icon" :class="'iconfont ' + item.icon"></i>
              <i v-else class="el-icon-wallet"></i>
              <span class="ellipsis">
                <tooltips :value="$t(`menu.${item.pathLanguage}`)" :title="$t(`menu.${item.pathLanguage}`)"></tooltips>
              </span>
            </h4>
            <div class="child-menu" v-for="child in item.children" :key="child.id">
              <p style="display: flex;" @click="handleRouter(child)">
                <i :class="'iconfont ' + child.meta.icon"></i>
                <span class="ellipsis">
                  <tooltips :value="$t(`menu.${child.meta.pathLanguage}`)"
                    :title="$t(`menu.${child.meta.pathLanguage}`)"></tooltips>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="botton">
        <p class="midFont set" @click="handleClose">{{$t('button.close')}}</p>
      </div>
    </div>
    <!-- </transition> -->
  </div>
</template>

<script>
import Auth from 'util/auth';
import config from 'util';

export default {
  name: 'menuNavigation',
  data () {
    return {
      config,
      permission_routers: [],
      isShow: false
    };
  },
  created () {
    const getRouter = Auth.hasMenuRouter(); // 拿到路由
    this.setRouter(getRouter);
    this.isShow = true;
  },
  methods: {
    setRouter (arr) {
      if (arr.length === 0) return;
      this.permission_routers = JSON.parse(JSON.stringify(arr));
    },
    handleClose () {
      this.$emit('close');
    },
    // 路由跳转
    handleRouter (item) {
      this.$router.push(`/${item.path}`);
      this.$emit('close');
    }
  }
};
</script>

<style scoped lang="scss">
.menuNavigation {
  position: fixed;
  max-width: calc(100% - 300px);
  left: 200px;
  top: 80px;
  min-width: 680px;
  // height: calc(100% - 50px);
  max-height: 100%;
  overflow: hidden;
  z-index: 1006;
  .model {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 1;
    z-index: 1005;
  }
  .menuNavigation-cons {
    max-height: 100%;
    position: relative;
    width: calc(100% - 0px);
    padding: 0 30px;
    box-sizing: border-box;
    background: white;
    z-index: 1100;
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
      .menu-first:last-child {
        margin-right: 0 !important;
      }
      .menu-first {
        width: 140px;
        overflow: hidden;
        // float: left;
        margin-right: 20px;
        flex-shrink: 0;
        // .ellipsis{
        //   display: flex;
        // }
        h4 {
          color: rgb(255, 115, 15);
          font-size: 14px;
          font-weight: bold;
          margin: 20px 0;
          height: 20px;
          i {
            margin-right: 8px;
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
        // .ellipsis{
        //   display: flex;
        // }
        i {
          margin-right: 8px;
        }
        &:hover {
          // background: rgb(237,245,255);
          color: #009F3A;
        }
      }
    }
    .botton {
      left: 32px;
      height: 32px;
      margin-top: 10px;
    }
  }
}
</style>
