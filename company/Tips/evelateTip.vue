<template>
  <el-popover
    :placement="placement"
    :close-delay="200"
    trigger="hover"
  >
    <div class="task-editor-cons evelateTip">
      {{ content }}
      <slot name="content"></slot>
    </div>
    <span slot="reference">
      <slot></slot>
    </span>
  </el-popover>
</template>

<script>
export default {
  name: 'EvelateTip',
  props: {
    content: {
      type: String,
      default: ''
    },
    placement: {
      type: String,
      default: 'top-start'
    },
    width: {
      type: [String, Number],
      default: '300'
    }
  }
}
</script>
<style lang="scss">
.task-editor-cons {
    width: 100%;
    max-height: 400px;
    max-width: 500px;
    overflow-y: auto;
    &.evelateTip {
        .title {
            margin-bottom: 8px;
        }
        p {
            line-height: 22px;
            margin: 8px 0;
            padding-left: 26px;
            position: relative;
            &::before {
                content: '';
                position: absolute;
                width: 7px;
                height: 7px;
                left: 6px;
                top: 8px;
                border-radius: 50%;
                display: inline-block;
                background: rgb(20,86,240);
                margin-right: 16px;
                vertical-align: middle;
            }
            em {
                font-style: normal;
                display: block;
                line-height: 22px;
                margin: 8px 0;
                padding-left: 20px;
                position: relative;
                &::before {
                    content: '';
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    left: 2px;
                    top: 8px;
                    border-radius: 50%;
                    border: 1px solid rgb(20,86,240);
                    display: inline-block;
                    margin-right: 16px;
                    vertical-align: middle;
                }
            }
        }
    }
}
</style>
