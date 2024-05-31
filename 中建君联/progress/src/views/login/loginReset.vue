<template>
  <div class='login-cons' :class="isMobileTerminal?'isMobileTerminal':''">
    <div class='logo'>
      <span>{{loginTitle}}</span>
    </div>
    <div class='login-tabs'>
      <div
        v-for='(item, index) in loginTabs'
        :key='index'
        :class="tabsKey === index ? 'active' : 'tabsList'"
        @click='loginTabsSubmit(index)'
      >{{item}}</div>
    </div>
    <!-- 密码登录 -->
    <div v-if='tabsKey === 0'>
      <el-form :model='loginForm' status-icon :rules='rules' ref='loginForm' class='demo-ruleForm'>
        <el-form-item prop='userCode'>
          <el-input
            v-model.number='loginForm.userCode'
            clearable
            :placeholder="$t('login.username')"
          >
            <i slot='prefix' class='el-input__icon el-icon-user midFont grey'></i>
          </el-input>
        </el-form-item>
        <el-form-item prop='password' :error='loginForm.errorMsg'>
          <el-input
            type='password'
            v-model='loginForm.password'
            :placeholder="$t('login.password')"
            @keyup.enter.native="PsssubmitForm('loginForm')"
            clearable
            auto-complete='off'
          >
            <i slot='prefix' class='el-input__icon el-icon-unlock midFont grey'></i>
          </el-input>
        </el-form-item>
      </el-form>
      <el-button
        type='primary'
        size='small'
        :disabled='isDisabled'
        @click.native.prevent="submitForm('loginForm')"
        :loading='logining'
      >{{$t('login.logIn')}}</el-button>
    </div>
    <div v-if='tabsKey === 1'>
      <el-form :model='loginMsg' status-icon :rules='rules' ref='loginMsg' class='login-msg-form'>
        <el-form-item prop='userCode'>
          <el-input v-model.number='loginMsg.userCode' clearable placeholder='手机号'>
            <i slot='prefix' class='el-input__icon el-icon-mobile midFont grey'></i>
          </el-input>
        </el-form-item>
        <el-form-item prop='code' :error='loginMsg.errorMsg'>
          <el-col :span='24'>
            <el-input v-model='loginMsg.code' maxlength='6' placeholder='短信验证码'>
              <i slot='prefix' class='el-input__icon el-icon-message midFont grey'></i>
            </el-input>
          </el-col>
          <div class='phoneCode'>
            <span v-if='sendAuthCode' class='midFont set' @click='getAuthCode'>获取验证码</span>
            <span v-else class='code active midFont grey'>{{auth_time}}秒后重新获取</span>
          </div>
        </el-form-item>
      </el-form>
      <el-button
        :disabled='isDisabled1'
        type='primary'
        size='small'
        @click.native.prevent="submitFormMsg('loginMsg')"
        :loading='logining'
      >登录</el-button>
    </div>
    <p class='midFont' style='margin-top: 20px'>
      <el-checkbox
        v-model='remember'
        style='float: left;'
        @click.prevent='rememberPassword($event)'
      >
        <span style='color: white;'>{{$t('login.rememberPassword')}}</span>
      </el-checkbox>
    </p>
    <p class='midFont' style='margin-top: 10px'>
      <!-- <span style='float: right;color: white;' @click.prevent='forgetPassWord($event)'>忘记密码</span> -->
    </p>
    <!-- 短信登录 -->
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import config from 'util/config';
import Auth from 'util/auth';

const Base64 = require('js-base64').Base64;

export default {
  props: {
    title: {
      type: String,
      default: '施工管理云后台登录'
    },
    n: {
      default: 0
    }
  },
  data () {
    return {
      loginMsg: { userCode: '', code: '', smsToken: '', errorMsg: '' },
      loginForm: { userCode: '', password: '', errorMsg: '' },
      logining: false,
      tabsKey: 0,
      loginTabs: ['密码登录', '短信登录'],
      sendAuthCode: true,
      passAuth_time: 0,
      auth_time: 0,
      rules: {
        password: [
          {
            required: true,
            message: this.$t('login.passwordErrorTips'),
            trigger: 'blur'
          }
        ],
        userCode: [
          {
            required: true,
            message: this.$t('login.usernameErrorTips'),
            trigger: 'blur'
          }
        ]
      },
      isDisabled: false,
      isDisabled1: false,
      isMobileTerminal: false,
      remember: false,
      type: 1 // 判断后台还是前台登录 0 后台 1 前台
    };
  },
  computed: {
    loginTitle () {
      return this.$t('login.title');
    }
  },
  created () {
    if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
      this.isMobileTerminal = true;
    } else {
      this.isMobileTerminal = false;
    }
  },
  watch: {},
  mounted () {
    const userName = localStorage.getItem('userName');
    if (userName) {
      this.loginForm.userCode = userName;
    }
    // 在页面加载时从cookie获取登录信息
    const userCode = this.getCookie('userCode');
    const password = Base64.decode(this.getCookie('password'));
    // 如果存在赋值给表单，并且将记住密码勾选
    if (password) {
      this.loginForm.userCode = userCode;
      this.loginForm.password = password;
      this.remember = true;
    }
  },
  methods: {
    ...mapActions({
      login: 'user/loginPassword'
    }),
    // 切换
    loginTabsSubmit (index) {
      this.tabsKey = index;
      this.loginForm.errorMsg = '';
      this.loginForm.loginMsg = '';
    },
    // 记住密码
    rememberPassword (ev) {
      ev.stopPropagation();
    },
    // 密码登录
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        this.loginForm.errorMsg = '';
        if (valid) {
          this.passLogin();
        } else {
          return false;
        }
      });
    },
    // 密码登录
    passLogin() {
      const userInfo = {
        u: this.loginForm.userCode,
        p: this.loginForm.password,
        d: 'customer',
        r: 'P2'
      };
      this.$store.dispatch('publicApi/passwordLoginPublic', userInfo).then((res) => {
        this.logining = true;
        if (res.status === 1) {
          const code = res.results.code;
          this.loginForm.errorMsg = this.$t(`errorCode.${code}`);
          this.logining = false;
        } else {
          localStorage.setItem('userName', this.loginForm.userCode);
          Auth.setToken(res.results.token);
          this.getUserInfo(res.results);
        }
      }).catch((error) => {
        this.logining = false;
      });
    },
    // 获取登录用户信息
    getUserInfo(val) {
      this.$store.dispatch('publicApi/getUserInfoPublic').then(res => {
        this.logining = false;
        res.results.token = val.token;
        res.results.userId = val.userId;
        this.$store.commit('user/SET_TOKEN', res.results);
        this.setCookie('token', res.results.token);
        Auth.setLanguage('zh');
        this.$emit('logined', true);
      });
    },
     setLoginAuth(userInfo) {
      this.logining = false;
      this.$emit('logined', true);
      localStorage.setItem('userName', this.loginMsg.userCode || this.loginForm.userCode);
      this.setCookie('token', userInfo.token);
      Auth.setLanguage('zh');
      this.setUserInfo();
      Auth.setUserInfo(userInfo);
    },
    // 密码回车登录
    PsssubmitForm (formName) {
      this.submitForm(formName);
    },
    // 储存表单信息
    setUserInfo () {
      // 判断用户是否勾选记住密码，如果勾选，向cookie中储存登录信息，
      // 如果没有勾选，储存的信息为空
      if (this.remember) {
        this.setCookie('userCode', this.loginForm.userCode);
        // base64加密密码
        const password = Base64.encode(this.loginForm.password);
        this.setCookie('password', password);
      } else {
        this.setCookie('userCode', '');
        this.setCookie('password', '');
      }
    },
    // 获取cookie
    getCookie (key) {
      if (document.cookie.length > 0) {
        let start = document.cookie.indexOf(`${key}=`);
        if (start !== -1) {
          start = start + key.length + 1;
          let end = document.cookie.indexOf(';', start);
          if (end === -1) end = document.cookie.length;
          return unescape(document.cookie.substring(start, end));
        }
      }
      return '';
    },
    // 保存cookie
    setCookie (cName, value, expiredays) {
      const exdate = new Date();
      exdate.setDate(exdate.getDate() + expiredays);
      // eslint-disable-next-line
      document.cookie = cName + '=' + decodeURIComponent(value) + (expiredays == null ? '' : ';expires=' + exdate.toGMTString());
    },
    //  获取验证码
    getAuthCode () {
      const userCode = this.loginMsg.userCode;
      // getPhoneCode(userCode)
      //   .then(res => {
      //     if (res.status === 1) {
      //       this.$message({
      //         message: res.errorMessage,
      //         type: 'error',
      //       });
      //     } else {
      //       this.$message({
      //         message: '获取验证码成功',
      //         type: 'success',
      //       });
      //       this.loginMsg.smsToken = res.results.smsToken;
      //       this.sendAuthCode = false;
      //       // 设置倒计时秒
      //       this.auth_time = 180;
      //       const auth_timetimer = setInterval(() => {
      //         this.auth_time--;
      //         if (this.auth_time <= 0) {
      //           this.sendAuthCode = true;
      //           clearInterval(auth_timetimer);
      //         }
      //       }, 1000);
      //     }
      //   })
      //   .catch(e => {
      //     this.$message({
      //       message: '服务繁忙',
      //       type: 'error',
      //     });
      //   });
    },
    // 短信登录
    submitFormMsg (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isDisabled1 = true;
          this.shortLogin(this.loginMsg)
            .then(res => {
              if (res.status === 1) {
                const code = res.results.code;
                this.errorCode = res.errorMessage;
                this.isDisabled1 = false;
              } else {
                this.loading = false;
                this.errorCode = '';
                // loginFirst(this.loginMsg.userCode).then(res => {
                //   if (res.status === 0) {
                //     if (res.results) {
                //       this.$emit('dialogFormPass', this.loginMsg.userCode);
                //       const passLogin = setTimeout(() => {
                //         this.isDisabled1 = false;
                //         clearTimeout(passLogin);
                //       }, 1000);
                //     } else {
                //       this.$emit('logined', true);
                //       const passLogin = setTimeout(() => {
                //         this.isDisabled1 = false;
                //         clearTimeout(passLogin);
                //       }, 1500);
                //     }
                //   }
                // });
                localStorage.setItem('userName', this.loginForm.userCode);
              }
            })
            .catch(e => {
              this.loading = false;
              this.isDisabled1 = false;
            });
        }
      });
    },
    forgetPassWord (ev) {
      ev.stopPropagation();
      let userCode = '';
      if (this.tabsKey === 0) {
        userCode = this.loginForm.userCode;
      } else if (this.tabsKey === 1) {
        userCode = this.loginMsg.userCode;
      }
      this.$emit('forget', userCode);
    }
  }
};
</script>

<style scoped lang='scss'>
.login-cons {
  width: 270px;
  min-height: 280px;
  margin: 0 auto;
  padding: 70px 40px 0 40px;
  background-color: rgba(78, 166, 214, 0.6);
  box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  border: solid 1px rgba(112, 195, 255, 0.4);
  position: absolute;
  top: 50%;
  z-index: 9999;
  margin-top: -150px;
  right: 150px;
  &.isMobileTerminal {
    /*position: inherit;*/
    right: 30%;
  }
  .login-tabs {
    height: 40px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    div {
      width: 50%;
      text-align: center;
      cursor: pointer;
    }
    div:first-child {
      border-right: 1px solid #ccc;
    }
    .active {
      color: #fff;
      text-decoration: underline;
    }
    .tabsList {
      color: rgba(255, 255, 255, 0.6);
    }
  }
  .el-button {
    width: 100%;
  }
  p {
    /*text-align: right;*/
    &:hover {
      cursor: pointer;
    }
  }
  .logo {
    width: 100%;
    text-align: center;
    position: absolute;
    z-index: 100;
    top: 32px;
    left: 0;
    span {
      color: white;
      font-size: 20px;
    }
  }
  .code {
    /*width: 100%;*/
    /*display: inline-block;*/
    /*height: 40px;*/
    /*text-align: center;*/
    border: 0;
    color: grey;
    /*background-color: #409EFF;*/
    /*border-radius: 5px;*/
    /*line-height: 40px;*/
    // &.active {
    //   /*background: grey;*/
    // }
  }
  .code-img {
    width: 100%;
    height: 40px;
    display: inline-block;
    background-color: #409eff;
    border-radius: 5px;
  }
}

.demo-ruleForm {
  .el-input {
    position: relative;
    margin-bottom: 6px;
    img {
      position: absolute;
      top: 10px;
      margin-right: 10px;
      left: 6px;
    }
  }
  .el-input__inner {
    text-indent: 60px;
  }
}

.login-msg-form {
  .el-input {
    position: relative;
    margin-bottom: 6px;
    img {
      position: absolute;
      top: 10px;
      margin-right: 10px;
      left: 6px;
    }
  }
  .el-input__inner {
    text-indent: 60px;
  }
}

.phoneCode {
  position: absolute;
  right: 10px;
}
</style>
