
<template>
  <div class="projectSourceDialog">
      <!-- 已选项目名称 -->
      <div class="title"><span class="midFont set">{{$t('dialog.selectProjectName')}}：</span>{{selectInfoData.projectName}}</div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
          <!-- 01工程项目,02科研项目 -->
          <el-tab-pane :label="$t('dialog.proProject')" name="01">
              <proProject v-if="activeName === '01'" :dialogHeight="dialogHeight" :selectInfo="selectInfoData" @getSelect="getSelect"
                  @getData="getData"  :close.sync="isDialogShow"></proProject>
          </el-tab-pane>
          <el-tab-pane :label="$t('dialog.proProjectResearch')" name="02">
              <proProjectResearch v-if="activeName === '02'" :dialogHeight="dialogHeight" :selectInfo="selectInfoData" @getSelect="getSelect"
                  @getData="getData"  :close.sync="isDialogShow"></proProjectResearch>
          </el-tab-pane>
      </el-tabs>
  </div>
</template>
<script>
export default {
  name: 'projectSourceDialog',
  data() {
      return {
          activeName: '01',
          selectInfoData: {},
          isDialogShow: true
      };
  },
  components: {
    proProject (resolve) {
      require(['./proProject/proProject.vue'], resolve);
    },
    proProjectResearch (resolve) {
      require(['./proProjectResearch/proProjectResearch.vue'], resolve);
    }
  },
  props: {
      dialogHeight: {
          type: Number,
          default: 300
      },
      selectInfo: {
          type: Object,
          default: () => {}
      }
  },
  watch: {
      isDialogShow: {
          handler() {
              this.$emit('update:close', this.isDialogShow);
          }
      },
      deep: true
  },
  created() {
      this.selectInfoData = this.$clone(this.selectInfo);
  },
  methods: {
      handleClick() {},
      getSelect(row) {
          this.selectInfoData = row;
      },
      getData() {
          this.$emit('getData', this.selectInfoData.projectName ? [this.selectInfoData] : []);
      }
  }
};
</script>
<style lang='scss' scoped>
.projectSourceDialog{
  height: 100%;
  .title{
      line-height: 40px;
      padding-left: 10px;
  }
  /deep/ .el-tabs{
      height: calc(100% - 40px);
      .el-tabs__content{
          height: calc(100% - 50px);
          .el-tab-pane{
              height: 100%;
          }
      }
  }
}
</style>
