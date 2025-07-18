<!--
 * @Author: your name
 * @Date: 2020-06-28 15:52:08
 * @LastEditTime: 2020-08-12 14:00:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_basicconfiguration-企业信息及配置\src\components\global\toPage\toPage.vue
-->
<template>
  <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage"
    :page-size="pageSize" :page-sizes="pageSizes" background :pager-count="pagerCount"
    layout="total, sizes, prev, pager, next, jumper" :total="total">
  </el-pagination>
</template>

<script>
export default {
  name: 'to-page',
  data () {
    return {
      currentPage: 1
    };
  },
  props: {
    pagesConfig: {
      type: Object,
      default: () => { }
    },
    // 每页显示个数选择器的选项设置
    pageSize: {
      type: Number,
      default: 0
    },
    // 总条目数
    total: {
      type: Number,
      default: 0
    },
    // 页码按钮的数量，当总页数超过该值时会折叠
    pagerCount: {
      type: Number,
      default: 5
    },
    // 每页显示个数选择器的选项设置
    pageSizes: {
      type: Array,
      default: () => [10, 20, 50, 100]
    }
  },
  methods: {
    handleSizeChange (val) {
      const obj = {
        isSzieChange: true,
        pageSize: val
      };
      this.$emit('sentPages', obj);
    },
    handleCurrentChange (val) {
      const obj = {
        isSzieChange: false,
        pageNo: val
      };
      this.$emit('sentPages', obj);
    },
    setCurrentPage () {
      this.currentPage = 1;
      const obj = {
        isSzieChange: false,
        pageNo: 1
      };
      this.$emit('sentPages', obj);
    }
  }
};
</script>

<style scoped>
</style>
