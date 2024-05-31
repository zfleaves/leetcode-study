const state = {
  // 已经开启的标签
  cachedPageList: [
    // 默认首页存在
    {
      name: 'home',
      path: '/home',
      saveContent: false,
      title: '首页',
      translateType: 'home',
      loadRouteName: '',
      isMenu: true
    }
  ],
  cachedPageName: ['home'],
  // 需要关闭的页面
  autoClosePage: {},
  // 当前页面
  currentPage: {},
  Person: false,
  // 路由标题
  RouteTitle: '',
  freshRoute: {},
  // 流程监控ID
  taskId: '',
  process_dialogFlag: false,
  qrCodeObj: ''

};
const mutations = {
  addTagNav (state, data) {
    if (state.cachedPageList.some(v => v.name === data.name && v.path === data.path)) return;
    const index = state.cachedPageList.findIndex(v => v.name === data.name && v.path !== data.path);
    if (index >= 0) {
      state.cachedPageList[index].name = data.name;
      state.cachedPageList[index].path = data.path;
      state.cachedPageList[index].title = data.meta.title || 'no-name';
      state.cachedPageList[index].translateType = data.meta.translateType || '';
      state.cachedPageList[index].loadRouteName = data.meta.loadRouteName || '';
      state.cachedPageList[index].isMenu = data.meta.isMenu;
    } else {
      state.cachedPageList.push({
        name: data.name,
        path: data.path,
        title: data.meta.title || 'no-name',
        saveContent: false,
        translateType: data.meta.translateType || '',
        loadRouteName: data.meta.loadRouteName || '',
        isMenu: data.meta.isMenu
      });
    }
    if (data.meta.isCached) {
      const iNow = state.cachedPageName.findIndex(v => v === data.name);
      if (iNow >= 0) {
        state.cachedPageName.splice(iNow, 1);
      }
      state.cachedPageName.push(data.name);
    }
  },
  removeTagNav (state, data) {
    if (data) {
      for (const [i, v] of state.cachedPageList.entries()) {
        if (v.name === data.name) {
          state.cachedPageList.splice(i, 1);
        }
      }
      const index = state.cachedPageName.indexOf(data.name);
      if (index >= 0) {
        state.cachedPageName.splice(index, 1);
      }
    } else {
      state.cachedPageList = [];
      state.cachedPageName = ['home'];
    }
  },

  // 刷新页面
  SET_FRESHROUTE (state, data) {
    state.freshRoute = data;
  },
  // 修改路由标题
  updateRouteTitle (state, data) {
    state.RouteTitle = data;
  },
  // 获取某个关闭页面的值
  SET_CLOSEPAGE (state, data) {
    if (data) {
      state.autoClosePage = data;
    } else {
      state.autoClosePage = {};
    }
  },

  // 页面发生了更改
  judgeCachedPageList (state, data) {
    const index = state.cachedPageList.findIndex(item => {
      return data.name === item.name;
    });
    state.cachedPageList[index].saveContent = true;
  },
  // 页面没有发生了更改
  judgeNoCachedPageList (state, data) {
    const index = state.cachedPageList.findIndex(item => {
      return data.name === item.name;
    });
    state.cachedPageList[index].saveContent = false;
  },

  DEL_CACHED_VIEW: (state, view) => {
    for (const i of state.cachedPageName) {
      if (i === view.name) {
        const index = state.cachedPageName.indexOf(i);
        state.cachedPageName.splice(index, 1);
        break;
      }
    }
  },

  DEL_OTHERS_VISITED_VIEWS: (state, view) => {
    for (const [i, v] of state.cachedPageList.entries()) {
      if (v.path === view.path) {
        state.cachedPageList = state.cachedPageList.slice(i, i + 1);
        break;
      }
    }
    if (view.name !== 'home') {
      state.cachedPageList.unshift({
        name: 'home',
        path: '/home',
        saveContent: false,
        title: '首页',
        translateType: 'home',
        loadRouteName: '',
        isMenu: true
      });
    }

  },

  DEL_OTHERS_CACHED_VIEWS: (state, view) => {
    for (const i of state.cachedPageName) {
      if (i === view.name) {
        const index = state.cachedPageName.indexOf(i);
        state.cachedPageName = state.cachedPageName.slice(index, index + 1);
        break;
      }
    }

  },

  DEL_ALL_VISITED_VIEWS: state => {
    state.cachedPageList = [
      {
        name: 'home',
        path: '/home',
        saveContent: false,
        title: '首页',
        translateType: 'home',
        loadRouteName: '',
        isMenu: true
      }
    ];
  },

  DEL_ALL_CACHED_VIEWS: state => {
    state.cachedPageName = ['home'];
  },

  SET_CURRENT_PAGE: (state, data) => {
    state.currentPage = data;
  },

  SetPerson: (state, data) => {
    state.Person = data;
  },

  // 流程监控弹窗
  set_qrCodeUrl: (state, data) => {
    if (data) {
      state.qrCodeObj = data;
    } else {
      state.qrCodeObj = '';
    }
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

  // 重置 vuex 数据
  resetTagNav: (state) => {
    state.cachedPageList = [
      // 默认首页存在
      {
        name: 'home',
        path: '/home',
        saveContent: false,
        title: '首页',
        translateType: 'home',
        loadRouteName: '',
        isMenu: true
      }
    ];
    state.cachedPageName = ['home'];
    // 需要关闭的页面
    state.autoClosePage = {};
    // 当前页面
    state.currentPage = {};
    state.Person = false;
    // 路由标题
    state.RouteTitle = '';
    state.freshRoute = {};
    state.taskId = '';
    state.process_dialogFlag = false;
    state.qrCodeObj = '';
  }

};

const actions = {

  delCachedView ({commit, state}, view) {
    return new Promise(resolve => {
      commit('DEL_CACHED_VIEW', view);
      resolve([...state.cachedPageName]);
    });
  },


  delOthersViews ({dispatch, state}, view) {
    return new Promise(resolve => {
      dispatch('delOthersVisitedViews', view);
      dispatch('delOthersCachedViews', view);
      resolve({
        visitedViews: [...state.cachedPageList],
        cachedViews: [...state.cachedPageName]
      });
    });
  },
  delOthersVisitedViews ({commit, state}, view) {
    return new Promise(resolve => {
      commit('DEL_OTHERS_VISITED_VIEWS', view);
      resolve([...state.cachedPageList]);
    });
  },
  delOthersCachedViews ({commit, state}, view) {
    return new Promise(resolve => {
      commit('DEL_OTHERS_CACHED_VIEWS', view);
      resolve([...state.cachedPageName]);
    });
  },


  delAllViews ({dispatch, state}, view) {
    return new Promise(resolve => {
      dispatch('delAllVisitedViews', view);
      dispatch('delAllCachedViews', view);
      resolve({
        visitedViews: [...state.cachedPageList],
        cachedViews: [...state.cachedPageName]
      });
    });
  },

  delAllVisitedViews ({commit, state}) {
    return new Promise(resolve => {
      commit('DEL_ALL_VISITED_VIEWS');
      resolve([...state.cachedPageList]);
    });
  },
  delAllCachedViews ({commit, state}) {
    return new Promise(resolve => {
      commit('DEL_ALL_CACHED_VIEWS');
      resolve([...state.cachedPageName]);
    });
  }

};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};

