<!--
 * @Author: your name
 * @Date: 2020-06-28 09:08:48
 * @LastEditTime: 2020-08-30 15:24:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_basicconfiguration-施工云企业信息及配置\src\views\lyout\compoent\scrollBar.vue
-->
<template>
  <div class="scroll-container left" ref="scrollContainer" @wheel.prevent="handleScroll">
    <div class="scroll-wrapper" ref="scrollWrapper" :style="{left: left + 'px'}">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  const padding = 10; // tag's padding
  export default {
    data () {
      return {
        left: 0,
        wheelSpeed: 30
      };
    },
    computed: {
      tagNavList () {
        return this.$store.state.tagNav.cachedPageList;
      }
    },
    watch: {
    },
    methods: {
      handleScroll (e) {
        const eventDelta = e.wheelDelta || -e.deltaY * 3;
        const $container = this.$refs.scrollContainer;
        const $containerWidth = $container.offsetWidth;
        const $wrapper = this.$refs.scrollWrapper;
        const $wrapperWidth = $wrapper.offsetWidth;

        if (eventDelta > 0) {
          this.left = Math.min(0, this.left + eventDelta);
        } else {
          if ($containerWidth - padding < $wrapperWidth) {
            if (this.left < -($wrapperWidth - $containerWidth + padding)) {
              this.left = this.left;
            } else {
              this.left = Math.max(this.left + eventDelta, $containerWidth - $wrapperWidth - padding);
            }
          } else {
            this.left = 0;
          }
        }
      },
      scrollToCurTag () {
        const $container = this.$refs.scrollContainer;
        const $containerWidth = $container.offsetWidth; // 900
        const $scrollWrapper = this.$refs.scrollWrapper;
        let totalLength = $scrollWrapper.children.length * 4;
        for (let i = 0; i < $scrollWrapper.children.length; i++) {
          const item = $scrollWrapper.children[i];
          totalLength += item.offsetWidth;
        }
        // 如果累计的宽度  和  盒子的宽度做笔记
        if (totalLength < $containerWidth) { // 小于则不移动
          this.left = 0;
        } else {
          this.left = -(totalLength - $containerWidth);
        }
      }
    }
  };
</script>

<style scoped lang="scss">

  .scroll-container {
    white-space: nowrap;
    position: relative;
    // overflow: hidden;
    height: 100%;
    width: 100%;
    overflow: hidden;
    .scroll-wrapper {
      height: 46px;
      width: 200%;
      position: absolute;
      background: #fafafa;
      // border-bottom: 1px solid rgb(201,201,201);
      &::before {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 1px;
          background-color: #dedede;
          z-index: 1;
      }
    }
  }
</style>
