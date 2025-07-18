<template>
  <div class="text-message" :class="{
      left: float == 'left',
      right: float == 'right',
      'max-width': !fullWidth,
    }">
    <div v-if="arrow" class="arrow"></div>
    <div class="pre">
      <pre v-html="html" />
      <!-- 查看附件 -->
      <p v-if="attachmentId" style="color: #ffa13a; cursor: pointer;padding: 3px 10px;" @click="attachmentLabel">
        {{$t('fConfig.attachmentSee')}}</p>
    </div>
  </div>
</template>
<script>
import { textReplaceEmoji, textReplaceLink } from 'mixins/filters/emojis';

export default {
  name: 'TextMessage',
  props: {
    content: {
      type: [String, Number],
      default: ''
    },
    receiverUsers: {
      type: Array,
      default: () => []
    },
    attachmentId: {
      type: String,
      default: ''
    },
    float: {
      type: String,
      default: 'left'
    },
    fullWidth: {
      type: Boolean,
      default: true
    },
    arrow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      html: ''
    };
  },
  created () {
    const text = textReplaceLink(this.content, this.float === 'right' ? '#ffffff' : 'rgb(9, 149, 208)');
    const receiverUsersStr = this.receiverUsers.length ? `<span style="color: ${this.float === 'right' ? '#ffffff' : '#009F3A'
      };">@${this.receiverUsers.map(v => v.userName).join('@')}</span>` : '';
    this.html = `${receiverUsersStr} ${textReplaceEmoji(text)}`;
  },
  methods: {
    attachmentLabel () {
      this.$emit('attachmentSee', this.attachmentId);
    }
  }
};
</script>
<style lang="scss" scoped>
.text-message {
  position: relative;
  min-width: 30px;
  min-height: 30px;
  border-radius: 5px;
  padding: 5px;

  .arrow {
    position: absolute;
    width: 0;
    height: 0;
    font-size: 0;
    border: 5px solid;
    top: 6px;
    left: -10px;
  }

  &.max-width {
    max-width: calc(100% - 50px);
  }

  &.left {
    color: #3a3a3a;
    background: #f5f5f5;

    .arrow {
      border-color: transparent #f5f5f5 transparent transparent;
    }
  }

  &.right {
    color: #ffffff;
    background: #009F3A;

    .arrow {
      right: -10px;
      left: unset;
      border-color: transparent transparent transparent #009F3A;
    }
  }

  pre {
    white-space: pre-wrap;
    overflow: hidden;
    word-break: break-word;
    word-wrap: break-word;
    font-size: 15px;
    padding: 3px 10px;
    font-family: "Microsoft YaHei";
    line-height: 25px;
  }
}
</style>
