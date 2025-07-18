<!--
 * @Author: your name
 * @Date: 2020-06-28 09:08:48
 * @LastEditTime: 2020-06-28 16:57:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_basicconfiguration-企业信息及配置\src\components\global\noData\noData.vue
-->
<template>
  <div>
    <img class="data-pic" :src="require('assets/images/public/no-data.png')" alt="">
    <!-- <div class="no-data">{{$t('globalData.noData')}}</div> -->
  </div>
</template>

<script>
export default {
  name: 'no-data'
};
</script>

<style scoped>
.no-data {
  color: rgb(144, 147, 153);
  font-size: 12px;
  text-align: center;
}
</style>
