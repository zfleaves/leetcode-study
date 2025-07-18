<!--
 * @Author: your name
 * @Date: 2020-07-15 15:00:55
 * @LastEditTime: 2021-08-04 15:12:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_unit\src\components\basicComponents\process\noProcess.vue
-->
<template>
  <div class="demo-ruleForm">
    <div class="cons" :style="{'height': processSubmitApi.startInfo.isNoPoProcess ? '80px' : '100px'}">
      <div class="cons_fix">
        <div style="text-align: center;">
          <!-- 本业务功能没有启用流程审批功能。 -->
          <p v-if="!processSubmitApi.startInfo.isNoPoProcess"> {{$t('dialog.noProcessTips1')}} </p>
          <!-- 提交后本条数据将更新为已审批状态。 -->
          <p> {{$t('dialog.noProcessTips2')}} </p>
          <!-- 已审批状态的数据不能撤回，不能修改，不能删除。 -->
          <p> {{$t('dialog.noProcessTips3')}} </p>
        </div>
      </div>
    </div>
    <div class="footer">
      <el-button
        icon="el-icon-circle-close"
        class="urgent" type="primary"
        size="small" @click="handleProcessClose(false)">{{$t('button.notToSubmit')}}
      </el-button>
      <el-button
        size="small"
        icon="el-icon-circle-check"
        type="primary"
        v-fast-click
        :disabled="submitDisabled"
        @click="handleProcessSubmit">{{$t('button.confirmSubmission')}}
      </el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'no-process',
    data() {
      return {
        submitDisabled: false
      };
    },
    props: {
      startForm: {
        type: Object,
        default: () => {}
      },
      processSubmitApi: {
        type: Object,
        default: () => {}
      }
  },
  created() {},
    methods: {
      // 暂不提交
      handleProcessClose(status) {
        this.$emit('closeDialog', status);
      },
      // 确认提交
      handleProcessSubmit() {
        this.submitDisabled = true;
        this.$store.dispatch(this.processSubmitApi.startSubmit.url, this.startForm).then(res => {
          if (res.status === 0) {
            this.handleProcessClose(true);
            this.$emit('refresh-parent');
            this.submitDisabled = false;
          } else {
            this.$message.error(this.$t(`exception.${res.errorCode}`));
            this.submitDisabled = false;
          }
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .demo-ruleForm {
    width: 100%;
    height: 170px;
    box-sizing: border-box;
    margin: auto;
    .cons {
      height: 100px;
      position: relative;
      padding: 0 20px;
      .cons_fix {
        position: absolute;
        bottom: 0;
        width: 100%;
        overflow-y: auto;
        &::-webkit-scrollbar {
          display: none;
        }
        p {
          line-height: 28px;
          text-align: left;
          color: #333333;
          font-size: 14px;
        }
      }
    }
  }

</style>
