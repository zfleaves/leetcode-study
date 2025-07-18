<template>
  <div id="app">
    <!-- 3、使用组件 -->
    <vue-editor v-model="content"></vue-editor>
  </div>
</template>

<script>
// 1、引用包
// eslint-disable-next-line import/no-extraneous-dependencies
import {VueEditor} from 'vue2-editor';

export default {
  // 2、添加组件
  components: {
    VueEditor
  },
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // content: '<h1>Some initial content</h1>'
    };
  }
};
</script>
