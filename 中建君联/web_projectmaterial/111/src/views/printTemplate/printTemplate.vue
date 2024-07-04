<!--
 * @Author: your name
 * @Date: 2020-11-18 13:57:32
 * @LastEditTime: 2021-06-11 09:49:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial-项目材料管理\src\views\printTemplate\printTemplate.vue
-->
<template>
  <div>
    <print style="height:100%;">
    </print>
  </div>
</template>
<script>
export default {
  // name: 'printTemplate',
  name: 'printTemplate',
  components: {
    print(resolve) {
      require(['components/basicComponents/printTemplate/printTemplate'], resolve);
    }
  }
};
</script>
