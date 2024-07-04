/*
 * @Author: your name
 * @Date: 2020-06-28 09:08:48
 * @LastEditTime: 2020-06-28 17:11:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_basicconfiguration-施工云企业信息及配置\src\store\modules\user\index.js
 */
import Auth from 'util/auth';

const state = {
  token: Auth.hasToken(),
  hasRouter: false,
  userInfo: '',
  overdueToken: false,
  node: '',
  updateNode: '',
  processRoleList: []
};

const mutations = {
  // 设置失效token
  SET_OVERDUETOKEN: (state, data) => {
    state.overdueToken = data;
  },
  // 设置缓存路由
  set_hasRouter: () => {
    state.hasRouter = true;
  },
  // 登录
  SET_TOKEN: (state, data) => {
    if (data) {
      Auth.setToken(data.token);
      Auth.setUserInfo(data);
    } else {
      Auth.removeToken();
      Auth.removeUserInfo();
    }
    state.userInfo = data;
    state.token = data.token;
  },
  // 设置节点
  setNode: (state, data) => {
    if (data) {
      state.node = data;
    } else {
      state.node = '';
    }
  },
  setProcessRoleList: (state, data) => {
    if (data) {
      state.processRoleList = data;
    } else {
      state.processRoleList = [];
    }
  },
  // 刷新节点
  setUpdateNode: (state, data) => {
    if (data) {
      state.updateNode = data;
    } else {
      state.updateNode = '';
    }
  },
  // 重置 vuex 数据
  resetUser: (state) => {
    state.token = '';
    state.token = '';
    state.hasRouter = false;
    state.overdueToken = false;
    state.node = '';
    state.updateNode = '';
    state.processRoleList = [];
  }
};

const actions = {
  // 手机密码登录
  loginPassword ({commit}, userInfo) {
    return new Promise((resolve, reject) => {
      this.$store.dispatch('login/passwordLogin', userInfo).then((response) => {
        if (response.status === 0) {
          commit('SET_TOKEN', response.results);
          resolve(response);
        } else {
          resolve(response);
        }
      }).catch((error) => {
        reject(error);
      });
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};

