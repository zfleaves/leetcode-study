<!--
 * @Author: your name
 * @Date: 2021-01-26 10:02:23
 * @LastEditTime: 2021-01-26 16:40:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\views\inspect\inspectRegister\inspectRegisterEdit.vue
-->
<template>
  <div>
    <edit-page @editEvent="editEvent" v-loading="loading">
      <div slot="editPage">
        <g-edit-form ref="editForm" v-if="pageConfigLoading" :type="type" :tableConfig="pageConfig.mainFormConfig"
          :projectForm="pageConfig.projectForm" @editFormEvent="editFormEvent">
        </g-edit-form>
      </div>
    </edit-page>
  </div>
</template>
<script>
import Page from './configEdit.js';
import { editPage } from 'mixins/editMixins';

export default {
  name: 'inspectRegisterEdit',
  mixins: [editPage],
  data () {
    return {
      page: new Page(),
      projectForm: {
        'attachment': '',
        'docNo': '',
        'inspectContent': '',
        'inspectContentFlg': '',
        'inspectDate': '',
        'inspectTypeId': '',
        'projectId': '',
        'projectName': '',
        'remarks': '',
        orgId: this.$utils.Auth.hasUserInfo().orgId,
        parentSubOrgId: this.$utils.Auth.hasUserInfo().parentSubOrgId,
        createTime: this.$utils.commonUtil.formatTime(new Date()),
        createByName: this.$utils.Auth.hasUserInfo().userName
      }
    };
  },
  props: {
    processParmas: {
      type: Object,
      default: () => { }
    }
  },
  methods: {
    // 获取info数据
    async _getInfoData (id = 0) {
      await this.handleGetInfoData(id, this.page.PageConfig.processParmas.infoUrl, () => {
      });
    },
    // 保存
    handleSave (isProcess = false) {
      console.log(this.pageConfig, 'pageConfig');
      this.$refs.editForm.getValidateForm(() => {
        const data = this.$clone(this.pageConfig.projectForm);
        this.handleSaveData(data, isProcess);
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.temperature {
  width: 100%;
  display: flex;
  .sp {
    display: inline-block;
    margin: 0 8px;
  }
  /deep/ .el-number {
    flex: 1;
  }
}
</style>
