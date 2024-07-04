/*
 * @Author: your name
 * @Date: 2020-06-28 09:08:48
 * @LastEditTime: 2020-08-24 13:58:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_basicconfiguration-施工云企业信息及配置\src\store\modules\diaLog\index.js
 */
const state = {
  sidebarOpen: true,
  processInfo: '',
  processForm: '',
  // 内容区域遮罩层信息
  contentLoading: {
    text: '加载中',
    status: false,
    bgcolor: 'rgba(0,0,0,0.7)'
  },
  process_dialogFlag: false,
  taskId: '',
  printStr: []
};

const mutations = {
  SET_SLIDEBAROPEN: (state, data) => {
    if (data) {
      state.sidebarOpen = false;
    } else {
      state.sidebarOpen = true;
    }

  },
  // 设置 流程详细信息
  set_processInfo: (state, data) => {
    state.processInfo = data;
  },
  // 设置 流程表单信息
  set_processForm: (state, data) => {
    state.processForm = data;
  },
  // 设置加载
  set_contentLoading: (state, data) => {
    state.contentLoading = {
      text: data.text,
      status: data.status,
      bgcolor: data.bgcolor || 'rgba(0,0,0,0.7)'
    };
  },
  // 流程监控弹窗
  set_process_dialog: (state, data) => {
    if (data) {
      state.taskId = data;
      state.process_dialogFlag = true;
    } else {
      state.taskId = '';
      state.process_dialogFlag = false;
    }
  },
  SET_PRINT_STR(state, data) {
    if (data) {
      state.printStr = data;
    } else {
      state.printStr = [];
    }
  },
  // 重置 vuex 数据
  resetDiaLog: (state) => {
    state.sidebarOpen = true;
    state.processInfo = '';
    state.processForm = '';
    state.taskId = '';
    state.printStr = [];
    state.process_dialogFlag = false;
  }
};


const actions = {};


export default {
  namespaced: true,
  state,
  mutations,
  actions
};
