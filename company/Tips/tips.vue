<template>
  <el-popover placement="top-end" trigger="hover">
    <!-- <span slot="reference" class="icon">?</span> -->
    <svg
      slot="reference"
      class="icon"
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 13 12"
      fill="none"
    >
      <g opacity="0.2">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M2.61091 2.11091C3.60568 1.11616 4.98137 0.5 6.5 0.5C8.01863 0.5 9.39432 1.11616 10.3891 2.11091C11.3838 3.10568 12 4.48136 12 6C12 7.51864 11.3838 8.89432 10.3891 9.88908C9.39432 10.8838 8.01864 11.5 6.5 11.5C4.98136 11.5 3.60568 10.8838 2.61091 9.88908C1.61616 8.89432 1 7.51863 1 6C1 4.48137 1.61616 3.10568 2.61091 2.11091ZM4.5 4.65619C4.5 3.55162 5.39543 2.65619 6.5 2.65619C7.60457 2.65619 8.5 3.55162 8.5 4.65619C8.5 5.58811 7.86261 6.37116 7 6.59318V7.15619C7 7.43233 6.77614 7.65619 6.5 7.65619C6.22386 7.65619 6 7.43233 6 7.15619V6.15619C6 5.88005 6.22386 5.65619 6.5 5.65619C7.05228 5.65619 7.5 5.20847 7.5 4.65619C7.5 4.10391 7.05228 3.65619 6.5 3.65619C5.94772 3.65619 5.5 4.10391 5.5 4.65619C5.5 4.93233 5.27614 5.15619 5 5.15619C4.72386 5.15619 4.5 4.93233 4.5 4.65619ZM7.125 8.78119C7.125 9.12636 6.84517 9.40619 6.5 9.40619C6.15483 9.40619 5.875 9.12636 5.875 8.78119C5.875 8.43601 6.15483 8.15619 6.5 8.15619C6.84517 8.15619 7.125 8.43601 7.125 8.78119Z"
          fill="#4E5969"
        />
      </g>
    </svg>
    <div
      class="item"
      v-for="(item, index) in content"
      :key="index"
      v-html="item"
    ></div>
  </el-popover>
</template>

<script>
export default {
  name: 'Tips',
  components: {},
  props: {
    content: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {}
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.icon {
  margin-left: 3px;
  display: inline-block;
  text-align: center;
  // width: 12px;
  // height: 12px;
  color: #aaaaaa;
  // font-size: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.item {
  font-size: 12px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  color: #222222;
  line-height: 24px;
}
</style>
