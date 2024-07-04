<!--
 * @Author: your name
 * @Date: 2020-06-28 09:08:48
 * @LastEditTime: 2020-07-29 20:11:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_basicconfiguration-施工云企业信息及配置\src\views\lyout\compoent\webMain.vue
-->
<template>
  <transition name="fade-transform" mode="out-in">
    <keep-alive :include="tagNavList">
      <router-view :key='key'>
      </router-view>
    </keep-alive>
  </transition>
</template>

<script>
  export default {
    components: {},
    computed: {
      tagNavList () {
        return this.$store.state.tagNav.cachedPageName;
      },
      key () {
        return this.$route.path;
      }
    },
    data () {
      return {};
    }
  };
</script>

<style scoped lang="scss">
  .contentWrap {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    bottom: 30px;
    left: 0;
    right: 0;
    overflow-y: auto;
  }
</style>
