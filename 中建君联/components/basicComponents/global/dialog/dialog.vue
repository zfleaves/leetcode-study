<!--
 * @Author: your name
 * @Date: 2020-07-17 15:22:34
 * @LastEditTime: 2023-05-05 14:56:33
 * @LastEditors: zengqin 1058574586@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_unit\src\components\basicComponents\global\dailog\dailog.vue
-->
<template>
  <el-dialog v-dialogDrag :title="dialogConfig.title || defaultConfig.title"
    :append-to-body="dialogConfig.appendBody || defaultConfig.appendBody"
    :center="dialogConfig.center || defaultConfig.center" :top="dialogConfig.top || defaultConfig.top"
    :visible.sync="isDialogVisible" :width="dialogConfig.width || defaultConfig.width" :before-close="handleClose">
    <div :style="{height: offsetHeight + 'px'}" class="dialog-body">
      <div class="dialog-body-conent">
        <slot name="body" :height="offsetHeight" class=""></slot>
        <slot name="footer"></slot>
      </div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      defaultConfig: {
        title: this.$t('button.info'),
        appendBody: true,
        center: true,
        top: '10vh',
        width: '60%'
      },
      offsetHeight: 300,
      isDialogVisible: false
    };
  },
  props: {
    dialogConfig: {
      type: Object,
      default: () => {
        return {
          title: '查看',
          appendBody: false,
          center: true,
          top: '10vh',
          width: '60%'
        };
      }
    },
    isClose: {
      type: Boolean,
      default: false
    },
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    this.getOffsetHeight();
    this.isDialogVisible = this.isVisible;
  },
  methods: {
    getOffsetHeight () {
      if (this.dialogConfig && this.dialogConfig.span) {
        this.offsetHeight = document.body.offsetHeight * this.dialogConfig.span;
      } else {
        this.offsetHeight = document.body.offsetHeight * 0.7;
      }
    },
    handleClose () {
      if (this.isClose) {
        this.$emit('close', false);
      } else {
        this.$emit('update:isVisible', false);
        this.isDialogVisible = false;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.dialog-body {
  overflow: hidden;
  width: 100%;
  position: relative;
  div {
    height: 100%;
  }
  .dialog-body-conent {
    position: absolute;
    width: 100%;
    top: 0;
    bottom: 0;
    overflow-y: auto;
    box-sizing: border-box;
    flex-direction: column;
    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
