<!--
 * @Author: your name
 * @Date: 2020-08-24 10:13:09
 * @LastEditTime: 2020-08-25 11:37:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\printTemplate\printDesign.vue
-->
<template>
  <print-design></print-design>
</template>
<script>
export default {
  components: {
      printDesign(resolve) {
          require(['components/basicComponents/printTemplate/printDesign'], resolve);
      }
  }
};
</script>
