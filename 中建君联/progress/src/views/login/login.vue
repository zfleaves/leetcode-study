<template>
  <div class="loginWrap" ref="loginWrap">
    <div class="headerWrap">
      <div class="logo" style="float: left;">
        <img :src="require('assets/images/public/logowhite.png')" alt />
      </div>
      <div class="language" style="float: right;">
        <a
          href="https://www.junnysoft.cn"
          style="color: white;"
          target="_blank"
          class="midFont set"
        >中建君联首页</a>
        <a
          href="https://weibo.com/junnysoft"
          target="_blank"
          @mouseover="changeMask"
          @mouseout="changeMask"
          style="color: white;font-size: 16px;"
          class="midFont set"
        >中建君联微博</a>
        <span
          @mouseover="changeMask2"
          @mouseout="changeMask2"
          style="color: white;font-size: 16px;"
          class="midFont set"
        >关注公众号</span>
        <language></language>
      </div>
      <div class="qrcodes" id="imgs">
        <img
          ref="qrImg1"
          v-show="qrImg1"
          class="qrImg2"
          :src="require('assets/images/SinaBlog.jpg')"
          alt="扫码关注建筑材料管理系统的微信公众号"
        />
        <img
          ref="qrImg2"
          v-show="qrImg2"
          class="qrImg1"
          :src="require('assets/images/PublicWeChat.jpg')"
          alt="扫码关注建筑材料管理软件的企业微博"
        />
      </div>
    </div>
    <div class="loginContents">
      <login-reset :n="n" class ref="loginReset" @logined="getLogined" v-show="!resetShow"></login-reset>
    </div>
    <div class="footerWrap">
      <login-footer></login-footer>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'login',
  components: {
    loginFooter (resolve) {
      require(['./loginFooter.vue'], resolve);
    },
    loginReset (resolve) {
      require(['./loginReset.vue'], resolve);
    },
    language (resolve) {
      require(['components/basicComponents/headNavigation/language.vue'], resolve);
    }
  },
  data () {
    return {
      resetShow: false,
      qrImg1: false,
      qrImg2: false,
      loading: false,
      carouselList: [
        {
          backgroundUrl: 'assets/images/loginbanner001.png',
          topTitle: '',
          bottomTitle: ''
        },
        {
          backgroundUrl: 'assets/images/loginbanner002.png',
          topTitle: '',
          bottomTitle: ''
        },
        {
          backgroundUrl: 'assets/images/loginbanner003.png',
          topTitle: '',
          bottomTitle: ''
        }
      ],
      n: 1 // 图片的index。
    };
  },
  methods: {
    ...mapActions({
      login: 'user/loginPassword'
    }),
    getLogined (val) {
      this.$router.push('/home');
      // 咋不需要弹窗
    },
    // 鼠标移入移出
    changeMask () {
      this.qrImg1 = !this.qrImg1;
    },
    changeMask2 () {
      this.qrImg2 = !this.qrImg2;
    }
  }
};
</script>

<style scoped lang="scss">
.loginWrap {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: url("../../assets/images/loginbanner.png");
  background-repeat: no-repeat;
   background-size: cover;
  .headerWrap {
    width: 100%;
    box-sizing: border-box;
    padding: 0 20px;
    line-height: 70px;
    height: 70px;
    z-index: 999;
    position: relative;
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    .logo {
      display: inline-block;
      margin-right: 20px;
      img {
        width: 170px;
        display: inline-block;
        vertical-align: middle;
      }
    }
    span {
      font-size: 42px;
      color: white;
    }
    .language {
      a {
        margin: 0 16px;
        font-size: 16px;
        text-decoration: none;
      }
      span {
        margin: 0 16px;
      }
    }
    .qrcodes {
      position: absolute;
      top: 66px;
      right: 20px;
      height: 120px;
      img {
        width: 120px;
        display: block;
        position: relative;
        float: right;
        &.qrImg1 {
          right: 50px;
        }
        &.qrImg2 {
          right: 162px;
        }
      }
    }
  }
  .loginContents {
    width: 100%;
    padding: 0 10%;
    z-index: 999;
    min-width: 1200px;
    display: flex;
    margin-top: 100px;
    .login_fun {
      transform: translateY(-100px);
      flex: 2;
      margin-right: 10%;
      img {
        width: 100%;
      }
    }
    .login-cons1 {
      flex: 1;
      transform: translateY(50px);
    }
  }
  .footerWrap {
    position: absolute;
    width: 100%;
    z-index: 999;
    text-align: center;
    height: 50px;
    opacity: 0.5;
    bottom: 0;
  }
  .home {
    a {
      margin: 0 16px;
      font-size: 16px;
    }
    span {
      margin: 0 16px;
    }
  }
  .el-carousel {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 33;
    opacity: 0.75;
    top: 0;
    bottom: 0;
    .carousel-tips {
      position: absolute;
      left: 200px;
      bottom: 130px;
      z-index: 10000;
      width: 400px;
      h2 {
        color: white;
        position: relative;
        &.top {
          margin-bottom: 40px;
        }
        &.bottom {
          left: 80px;
        }
      }
    }
    img {
      width: 100%;
      /*height: 100%;*/
      display: none;
      transition: all 0.5s linear;
      &:hover {
        transform: scale(1.1);
      }
      &.active {
        display: block;
      }
    }
    .el-carousel-item {
      width: 100%;
      height: 100%;
      position: relative;
      background-size: cover;
    }
    .el-carousel__indicator {
      margin: 0 8px;
    }
  }
  .qrcodes {
    position: absolute;
    top: 66px;
    right: 50px;
    height: 120px;
    img {
      width: 120px;
      display: block;
      position: relative;
      float: right;
      &.qrImg1 {
        right: 50px;
      }
      &.qrImg2 {
        right: 162px;
      }
    }
  }

  .banner {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 33;
    opacity: 0.75;
    top: 0;
    .bannerImg {
      position: relative;
      height: 100%;
      width: 100%;
      overflow: hidden;
      .el-carousel-item {
        width: 100%;
        height: 100%;
        display: none;
        &.active {
          display: block;
        }
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    .bannerBtn {
      position: absolute;
      list-style: none;
      bottom: 20px;
      left: 50%;
      -webkit-transform: translateX(-50%);
      transform: translateX(-50%);
      margin: 0;
      padding: 0;
      z-index: 99999;
      li {
        display: inline-block;
        background-color: transparent;
        padding: 12px 4px;
        cursor: pointer;
        margin: 0 8px;
        button {
          height: 5px;
          width: 35px;
          border-radius: 2px;
          display: block;
          opacity: 0.48;
          background-color: #fff;
          border: none;
          outline: 0;
          padding: 0;
          margin: 0;
          cursor: pointer;
          -webkit-transition: 0.3s;
          transition: 0.3s;
          &.active {
            opacity: 1;
          }
        }
      }
    }
    .carousel-tips {
      position: absolute;
      left: 200px;
      bottom: 130px;
      z-index: 10000;
      width: 400px;
      h2 {
        color: white;
        position: relative;
        font-size: 35px;
        opacity: 1 !important;
        &.top {
          margin-bottom: 40px;
        }
        &.bottom {
          left: 80px;
        }
      }
    }
    .el-carousel__arrow {
      z-index: 10000;
    }
  }
}
</style>
