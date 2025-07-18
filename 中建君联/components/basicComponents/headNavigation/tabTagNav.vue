<!--
 * @Author: your name
 * @Date: 2021-12-27 10:55:45
 * @LastEditTime: 2022-09-29 15:38:52
 * @LastEditors: zengqin 1058574586@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \web_bi-商业智能\src\components\basicComponents\headNavigation\tabTagNav.vue
-->
<template>
  <div class="tabTagNav">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <!-- label="用户管理" -->
      <el-tab-pane :name="item.path" v-for="(item, index) in tagNavList" :key="item.path">
        <router-link ref='tag' tag="span" :title='item.title' @contextmenu.prevent.native='openMenu(item,$event,index)'
          @mouseover.native="mouseoverTagMenu(item)" @mouseLeave.native="mouseLeaveTagMenu(item)" :to='item.path'
          :key='index' slot="label">
          <span v-if="item.isReport">{{getIsReport(item.path)}}</span>
          <span
            v-else-if="(item.name === 'processApprovalPage' || item.name === 'sceneProcessApprovalPage')">{{$t(`button.${type || 'info'}`)}}</span>
          <span v-else-if="item.isMenu">{{$t(`menu.${item.name}`)}}</span>
          <span v-else>{{$t(`menu.${item.loadRouteName}`)}}{{$t(`button.${item.translateType}`)}}</span>
          <span v-if="tagNavList.length > 1" class="el-icon-close"
            @click.prevent.stop='closeTheTag(item, index)'></span>
        </router-link>
      </el-tab-pane>
    </el-tabs>
    <ul v-show='visible' :style="{left:left+'px',top:top+'px'}" class='contextmenu'>
      <li v-show="tagNavList.length !== 1" @click='closeTheTag(selectedTag,selectIndex)'>
        {{$t('tagsView.close')}}
      </li>
      <li @click='refreshSelectedTag(selectedTag)' v-show='isActive(selectedTag)'>
        {{$t('tagsView.refresh')}}
      </li>
      <li v-show="tagNavList.length !== 1" @click='closeOthersTags(selectedTag)'>
        {{$t('tagsView.closeOthers')}}
      </li>
      <li v-show="tagNavList.length !== 1" @click='closeAllTags(selectedTag)'>
        {{$t('tagsView.closeAll')}}
      </li>
    </ul>
  </div>
</template>

<script>
import Auth from 'util/auth';
import { mapActions } from 'vuex';

export default {
  name: 'tabTagNav',
  inject: ['reload'],
  data () {
    return {
      defaultPage: '/home',
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      selectIndex: '',
      permission_routers: [],
      type: '',
      activeName: 'home',
      toPath: ''
    };
  },
  computed: {
    subTitle () {
      const params = this.$route.params;
      return params && params.subTitle ? this.$route.params.subTitle : '';
    },
    translateName () {
      const params = this.$route.params;
      return params && params.translateName ? this.$route.params.translateName : '';
    },
    tagNavList () {
      const cachedPageList = this.$store.state.tagNav.cachedPageList;
      for (const item of cachedPageList) {
        item.isClose = false;
        const translateType = item.translateType === 'info' ? 'detailsInfo' : item.translateType;
        const RouteTitle = localStorage.getItem('RouteTitle') ? JSON.parse(localStorage.getItem('RouteTitle')) : {};
        if (RouteTitle.translateType === 'renew') {
          // 变更
          const routerList = ['planPanoramaChangeEdit', 'planSpecialChangeEdit', 'qualityDistributeLearningEdit', 'proProjectApprovalApplyEdit', 'proProjectEdit'];
          if (routerList.includes(RouteTitle.name)) {
            this.$set(item, 'translateType', 'add');
          }
        } else {
          this.$set(item, 'translateType', translateType);
        }
      }
      return cachedPageList;
    },
    autoClosePage () {
      return this.$store.state.tagNav.autoClosePage;
    },
    RouteTitle () {
      return this.$store.state.tagNav.RouteTitle;
    }
  },
  created () {
    const params = this.$route.params;
    this.type = params && params.type ? this.$base64.decode(this.$route.params.type) : '';
  },
  mounted () {
    this.addTagNav();
    // this.setCurrentPage();
    const time = setInterval(() => {
      const loadMenuLanguag = localStorage.getItem('loadMenuLanguag');
      if (Number(loadMenuLanguag)) {
        this.activeName = this.$route.path;
        clearInterval(time);
      }
    }, 20);
    this.$store.commit('tagNav/SET_CURRENT_PAGE', this.$route);
    //   this.closePage();
  },
  watch: {
    $route (newVal, oldVal) {
      this.addTagNav();
      this.setCurrentPage();
    },
    visible (value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu);
      } else {
        document.body.removeEventListener('click', this.closeMenu);
      }
    }
  },
  methods: {
    ...mapActions({
      refresh: 'tagNav/delCachedView',
      delOthersViews: 'tagNav/delOthersViews',
      delAllViews: 'tagNav/delAllViews'
    }),
    // 存取 当前页面
    setCurrentPage () {
      this.$store.commit('tagNav/SET_CURRENT_PAGE', this.$route);
      this.activeName = this.$route.path;
    },
    IsRouteTo (item) {
      return item.path !== '/home';
    },
    generateRoute () {
      if (this.$route.name) {
        let obj = localStorage.getItem('RouteTitle');
        obj = obj ? JSON.parse(obj) : '';
        if (obj.name && this.$route.name === obj.name) {
          this.$route.meta.loadRouteName = obj.loadRouteName;
          const translateType = obj.translateType === 'info' ? 'detailsInfo' : obj.translateType;
          this.$set(obj, 'translateType', translateType);
          this.$route.meta.translateType = obj.translateType;
          this.$route.meta.isMenu = false;
        } else {
          this.$route.meta.isMenu = true;
        }
        return this.$route;
      }
      return false;
    },
    isActive (item) {
      return item.path === this.$route.path;
    },
    addTagNav () {
      const route = this.generateRoute();
      if (!route) {
        return false;
      }
      if (route.isRoute === 0) return;
      const currentMenu = this.$utils.menu.getCurrentMenu(route.name);
      if (currentMenu.id) {
        this.$store.dispatch('publicApi/addCommonUsedMenu', { menuId: currentMenu.id }).then(res => {
          // console.log(res);
        });
      }
      this.$store.commit('tagNav/addTagNav', route);
    },
    handleClick () {},

    // 获取报表翻译
    getIsReport (path) {
      const pathList = path.split('/');
      let tagName = '';
      tagName = this.$t(`${pathList[pathList.length - 1]}.${pathList[pathList.length - 2]}`);
      return tagName;
    },
    handleMousewheel (e) {
      // console.log(e, 'e');
    },
    closeTheTag (item, index) {
      // 当关闭当前页面的Tag时，则自动加载前一个Tag所属的页面
      // 如果没有前一个Tag，则加载默认页面
      this.$store.commit('tagNav/removeTagNav', item);
      if (this.$route.name === item.name) {
        if (index) {
          this.$router.push(this.tagNavList[index - 1].path);
        } else {
          this.$router.push(this.defaultPage);
          if (this.$route.path === '/home') {
            this.addTagNav();
          }
        }
      }
    },
    // 刷新
    refreshSelectedTag (view) {
      this.reload();
    },
    // 关闭其他
    closeOthersTags (selectedTag) {
      this.delOthersViews(selectedTag).then();
      if (this.isActive(selectedTag)) return;
      this.$router.push(selectedTag.path);

    },
    // 关闭所有
    closeAllTags (selectedTag) {
      this.delAllViews();
      this.$router.push('/home');
    },
    isClosable (item, index) { },
    mouseoverTagMenu (item) {
      this.$set(item, 'isClose', true);
    },
    mouseLeaveTagMenu (item) {
      this.$set(item, 'isClose', false);
    },
    openMenu (tag, e, index) {
      const menuMinWidth = 105;
      const offsetLeft = this.$el.getBoundingClientRect().left;// container margin left
      const offsetWidth = this.$el.offsetWidth;// container width
      const maxLeft = offsetWidth - menuMinWidth; // left boundary
      const left = e.clientX - offsetLeft;// 15: margin right
      if (left > maxLeft) {
        this.left = maxLeft;
      } else {
        this.left = left;
      }
      this.top = e.clientY - 60;
      this.visible = true;
      this.selectedTag = tag;
      this.selectIndex = index;
    },
    closeMenu () {
      this.visible = false;
    }
  }
};
</script>

<style scoped lang="scss">
/deep/ .tagNav {
  height: 30px !important;
}
.tabTagNav {
  width: 100%;
  height: 100%;
  padding: 0 10px;
  // padding-left: 20px;
  box-sizing: border-box;
  background: #fbfbfc;
  height: 45px !important;
  line-height: 45px;
  position: relative;
  /deep/ .el-tabs__header {
    margin-bottom: 0;
  }
  /deep/ .el-tabs__nav-scroll {
    padding-left: 0;
  }
  /deep/ .el-tabs__nav-wrap::after {
    height: 1px;
    background-color: transparent !important;
  }
  /deep/ .el-tabs__active-bar {
    background: transparent !important;
  }
  // /deep/ .el-tabs__item.is-active{
  //     background: rgba(239, 53, 51, 0.1);
  // }
  /deep/ .el-tabs__item {
    height: 45px;
    line-height: 45px;
    text-align: center;
    box-shadow: none !important;
    outline: none !important;
    padding: 0 10px;
    font-size: 16px;
    .router-link-active {
      font-weight: 700;
      // background: rgba(239, 53, 51, 0.1);
      font-size: 16px;
      border-bottom: 1px solid #009F3A;
    }
    &:last-child {
      margin-right: 15px !important;
      padding-left: 0;
      padding-right: 0;
    }
    &:hover {
      color: #009F3A;
      .el-icon-close {
        display: inline-block;
      }
    }
    .el-icon-close {
      position: absolute;
      top: 2px;
      display: none;
    }
    span {
      height: 44px;
      line-height: 44px;
      box-sizing: border-box;
      padding: 0 5px;
      display: inline-block;
    }
    .el-icon-close {
      height: 14px;
      width: 14px;
      line-height: 14px;
      padding: 0;
    }
  }
}
.contextmenu {
  margin: 0;
  background: #fff;
  /*display: none;*/
  box-sizing: border-box;
  z-index: 100;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 400;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
  li {
    margin: 0;
    padding: 0px 16px;
    line-height: 32px;
    // box-sizing: border-box;
    height: 32px;
    cursor: pointer;
    &:hover {
      background: #eee;
    }
  }
}
</style>
