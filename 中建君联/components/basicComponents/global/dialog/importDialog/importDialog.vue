<template>
  <el-dialog :title="dialogConfig.title || defaultConfig.title"
    :append-to-body="dialogConfig.appendBody || defaultConfig.appendBody"
    :center="dialogConfig.center || defaultConfig.center" :top="dialogConfig.top || defaultConfig.top"
    :visible.sync="isDialogVisible" :width="dialogConfig.width || defaultConfig.width" :before-close="handleClose">
    <div :style="{height: offsetHeight + 'px'}" class="dialog-body">
      <div class="header-button">
        <el-button class="urgent" type="primary" icon="el-icon-delete" size="small"
          @click="handleDialogStatus('delete')">{{$t('button.batchDeletion')}}
        </el-button>
      </div>
      <div class="cons">
        <div class="fixed-scroll1">
          <slot name="body" :height="tableHeight"></slot>
          <!-- <div class="content">
                        <slot name="body" :height="tableHeight"></slot>
                    </div> -->
        </div>
      </div>
      <div class="footer">
        <el-button class="urgent" type="primary" icon="el-icon-circle-close" size="small"
          @click="handleDialogStatus('close')">{{$t('button.close')}}
        </el-button>
        <el-button size="small" type="primary" icon="el-icon-circle-check" @click="handleDialogStatus('save')"
          v-fast-click>{{$t('button.determine')}}
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      defaultConfig: {
        title: '选择',
        appendBody: false,
        center: true,
        top: '10vh',
        width: '60%'
      },
      offsetHeight: 300,
      tableHeight: 200,
      isDialogVisible: false
    };
  },
  props: {
    dialogConfig: {
      type: Object,
      default: () => {
        return {
          title: '选择',
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
        this.offsetHeight = document.body.offsetHeight * 0.6;
      }
      this.tableHeight = this.offsetHeight - 46 * 2 - 20;
      // console.log(this.offsetHeight, 'this.offsetHeight');
      // console.log(this.tableHeight, 'this.tableHeight');
    },
    handleClose () {
      if (this.isClose) {
        this.$emit('close', false);
      } else {
        this.$emit('update:isVisible', false);
        this.isDialogVisible = false;
      }
    },
    // 弹出框页面按钮
    handleDialogStatus (status) {
      this.$emit('dialogEvent', status);
    }
  }
};
</script>
<style lang="scss" scoped>
.dialog-body {
  overflow: hidden;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .header-button {
    text-align: right;
    margin-bottom: 10px;
  }
  .cons {
    flex: 1;
    position: relative;
    width: 100%;
    .fixed-scroll1 {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 100%;
    }
    .content {
      // width: 100%;
      // height: 100%;
      display: flex;
    }
  }
  .footer {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 10px 0;
  }
}
</style>
