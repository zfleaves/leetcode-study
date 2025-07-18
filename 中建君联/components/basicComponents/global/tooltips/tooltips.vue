<!--
 * @Author: your name
 * @Date: 2020-07-09 15:00:45
 * @LastEditTime: 2021-05-17 12:19:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_basicconfiguration\src\components\basicComponents\global\tooltips\tooltips.vue
-->
<template>
  <div class="tooltip" ref="isOverflow" :class="border?'border':''" @mouseenter="enter">
    <el-tooltip v-if="isEllipsis || isCustomWidth" class="item" effect="dark" :content="value" placement="top">
      <span>
        <i v-if="isMust">*</i>
        {{value}}
      </span>
    </el-tooltip>
    <span v-else>
      <i v-if="isMust">*</i>
      {{value}}
    </span>
  </div>
</template>

<script>
  export default {
    name: 'borrow',
    data() {
      return {
        isEllipsis: false,
        offset: 0
      };
    },
    props: {
      value: {},
      border: {
        type: Boolean,
        default: false
      },
      isCustomWidth: {
        type: Boolean,
        default: false
      },
      isMust: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      isCollapse() {
        return this.$store.state.diaLog.sidebarOpen;
      }
    },
    watch: {
      value() {
        this.judgeMax();
      },
      isCollapse() {
        this.judgeMax();
      }
    },
    mounted() {
      this.judgeMax();
    },
    methods: {
      judgeMax() {
        if (this.isCustomWidth) return;
        setTimeout(() => {
          const isOverflow = this.$refs.isOverflow;
          const cWidth = isOverflow && isOverflow.clientWidth;
          const sWidth = isOverflow && isOverflow.scrollWidth;
          this.isEllipsis = sWidth > cWidth;
        }, 300);
        // this.$nextTick(() => {
        //   const isOverflow = this.$refs.isOverflow;
        //   const cWidth = isOverflow.clientWidth;
        //   const sWidth = isOverflow.scrollWidth;
        //   console.log(isOverflow, cWidth, sWidth, 'sWidth');
        //   this.isEllipsis = sWidth > cWidth;
        // });
      },
      enter(e) {
        const clientWidth = e.toElement.clientWidth;
        this.offset = clientWidth / 3;
      }
    }
  };
</script>
<style scoped lang="scss">
  .tooltip {
    width: 100%;
    height: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    position: relative;
    &.border {
      background-color: #F5F7FA;
      border-color: #E4E7ED;
      color: #606266;
      cursor: not-allowed;
      -webkit-appearance: none;
      background-image: none;
      border-radius: 4px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      display: inline-block;
      font-size: inherit;
      outline: 0;
      padding: 0 15px;
      -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
      transition: border-color .2s cubic-bezier(.645,.045,.355,1);
      width: 100%;
    }
    i {
      color: #F56C6C;
      margin-right: 4px;
    }
  }
</style>
