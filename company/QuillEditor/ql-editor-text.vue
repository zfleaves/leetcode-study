<template>
  <div
    class="ql-editor ql-editor-text"
    @click="handleClickFun"
    v-html="text"
    :key="text"
  ></div>
</template>

<script>
export default {
  name: 'QlEditorText',
  props: {
    text: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      clickFun: null,
      dom: null
    }
  },
  mounted() {
  },
  methods: {
    handleClickFun(e) {
      if (e.target.className === 'mention') {
        this.handleOpenDetail(e.target.dataset)
        return
      }
      if (e.target?.parentNode?.className === 'mention') {
        this.handleOpenDetail(e.target?.parentNode.dataset)
        return
      }
      if (e.target?.parentNode?.parentNode?.className === 'mention') {
        this.handleOpenDetail(e.target?.parentNode?.parentNode.dataset)
      }
    },
    handleOpenDetail(dataset) {
      const { prop, demandId, taskId } = dataset
      if (prop === 'demand') {
        this.handleOpenDemandDetail(demandId)
        return
      }
      if (prop === 'task') {
        this.handleOpenTaskDetail(taskId)
      }
    },
    // 跳转需求详情
    handleOpenDemandDetail(demandId) {
      window.open(`/demandDetail?id=${demandId}`)
    },
    // 跳转任务详情
    handleOpenTaskDetail(taskId) {
      window.open(`/taskDetail?id=${taskId}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.ql-editor-text{
  /deep/ pre{
    white-space: normal;
  }
}
</style>
