<!--
 * @Author: your name
 * @Date: 2021-12-06 10:56:21
 * @LastEditTime: 2021-12-07 09:19:19
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \web_portal\src\components\global\IMNotice\messaege\WelcomeModule.vue
-->
<template>
  <div class="welcome-box">
    <div class="famous-box">
      <img src="assets/images/chat.png" width="300" />
      <p>
        不是井里没有水，而是你挖的不够深<br />
        不是成功来得慢，而是你努力的不够多<br />
        加油吧！ ......
      </p>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
  created() {},
  methods: {}
};
</script>
<style lang="scss" scoped>
.welcome-box {
  height: 100%;
  width: 100%;

  .famous-box {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100%;
    font-size: 24px;
    user-select: none;

    p {
      width: 100%;
      font-weight: 300;
      text-align: center;
      font-size: 15px;
      color: #b9b4b4;
      margin-top: -30px;
    }
  }
}
</style>
