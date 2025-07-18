<template>
  <div class="drawer">
    <div :class="maskClass" @click="closeByMask"></div>
    <div :class="mainClass" :style="mainStyle" class="main">
      <div class="drawer-head">
        <span>{{ title }}</span>
        <span class="close-btn" v-show="closable" @click="closeByButton">
            <i class="el-icon-close"></i>
        </span>
      </div>
      <div class="drawer-footer">
        <slot name="but">
        </slot>
      </div>
      <div class="drawer-body">
        <div class="fixed-scroll" style="padding: 10px 15px;">
          <slot name="body">
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      // 是否打开
      display: {
        type: Boolean
      },

      // 标题
      title: {
        type: String,
        default: '标题'
      },

      // 是否显示关闭按钮
      closable: {
        type: Boolean,
        default: false
      },

      // 是否显示遮罩
      mask: {
        type: Boolean,
        default: true
      },

      // 是否点击遮罩关闭
      maskClosable: {
        type: Boolean,
        default: true
      },

      // 宽度
      width: {
        type: String,
        default: '400px'
      },

      // 是否在父级元素中打开
      inner: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      maskClass () {
        const params1 = {
          'mask-show': (this.mask && this.display),
          'mask-hide': !(this.mask && this.display),
          'inner': this.inner
        };
        return params1;
      },
      mainClass () {
        const params2 = {
          'main-show': this.display,
          'main-hide': !this.display,
          'inner': this.inner
        };
        return params2;
      },
      mainStyle () {
        const params3 = {
          width: this.width,
          right: this.display ? '0' : `-${this.width}`,
          top: '10px',
          border: this.mask ? 'none' : '1px solid #eee',
          boxShadow: '-5px 0px 10px rgba(0,0,0,0.1)'
        };
        return params3;
      }
    },
    mounted () {
      // console.log(this.mask, 'mask');
      if (this.inner) {
        const box = this.$el.parentNode;
        box.style.position = 'relative';
      }
    },
    methods: {
      closeByMask () {
        this.maskClosable && this.$emit('update:display', false);
      },
      closeByButton () {
        this.$emit('update:display', false);
      }
    }
  };
</script>

<style lang="scss" scoped>
  .drawer {
    /* 遮罩 */
    .mask-show {
      position: fixed !important;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 10;
      background-color: rgba(0, 0, 0, .5);
      opacity: 1;
      transition: opacity .5s;
    }
    .mask-hide {
      opacity: 0;
      transition: opacity .5s;
    }

    /* 滑块 */
    .main {
      position: fixed;
      z-index: 10;
      top: 0;
      height: 100%;
      background: #fff;
      transition: all 0.5s;
    }
    .main-show {
      opacity: 1;
    }
    .main-hide {
      opacity: 0;
    }

    /* 某个元素内部显示 */
    .inner {
      position: absolute;
    }

    /* 其他样式 */
    .drawer-head {
      display: flex;
      justify-content: space-between;
      height: 45px;
      line-height: 45px;
      padding: 0 15px;
      font-size: 16px;
      // font-weight: bold;
      border-bottom: 1px solid #eee;
      .close-btn {
        display: inline-block;
        cursor: pointer;
        height: 100%;
        padding-left: 20px;
      }
    }
    .drawer-body {
      font-size: 14px;
      padding: 15px;
      box-sizing: border-box;
      height: calc(100% - 100px);
      position: relative;
    }
    .drawer-footer {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 45px;
      line-height: 45px;
      padding: 0 15px;
      font-size: 14px;
      border-bottom: 1px solid #eee;
      > * {
        display: flex;
      }
    }
  }
</style>
