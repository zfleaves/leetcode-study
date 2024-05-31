<!--
 * @Author: your name
 * @Date: 2021-01-21 14:50:58
 * @LastEditTime: 2021-01-22 09:21:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\views\projectMsterPlan\test.vue
-->
<template>
  <div class="test">
        <div class="contents">
            <gantt>
            </gantt>
        </div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            task: {
                data: [],
                links: []
            }
        };
    },
    components: {
      gantt (resolve) {
        require(['components/gantt/gantt.vue'], resolve);
      }
    },
    methods: {
        handleSave() {

        }
    }
};
</script>

<style lang="scss" scoped>
.test {
    width: 100%;
    height: 100%;
    .buttons {
        margin-bottom: 10px;
    }
    .contents {
        flex: 1;
    }
}
</style>
