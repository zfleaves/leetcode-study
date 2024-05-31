<!--
 * @Author: your name
 * @Date: 2021-04-14 09:40:23
 * @LastEditTime: 2021-04-25 15:22:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\views\durationRisk\durationRiskConfig\durationRiskConfigEdit.vue
-->
<template>
  <div>
    <edit-page @editEvent="editEvent" v-loading="loading">
      <div slot="editPage">
        <g-edit-form ref="editForm" v-if="pageConfigLoading" :type="type" :tableConfig="pageConfig.mainFormConfig"
          :projectForm="pageConfig.projectForm" @editFormEvent="editFormEvent" :customRules="customRules">
        </g-edit-form>
      </div>
    </edit-page>
  </div>
</template>
<script>
import Page from './configEdit.js';
import { editPage } from 'mixins/editMixins';

export default {
  name: 'durationRiskConfigEdit',
  mixins: [editPage],
  data () {
    const sortsValid = (rule, value, callback) => {
        if (value || value === 0) {
            this.$store.dispatch('durationRiskConfig/checkSorts', {sorts: value, riskConfigId: this.pageConfig.projectForm.id || ''}).then(res => {
                if (res.results) {
                    // 重复，请重新输入
                    callback(new Error(`${this.$t(this.$t('fConfig.sorts'))}${this.$t('tips.repeat')}`));
                } else {
                    callback();
                }
            });
        } else {
            callback(new Error(`${this.$t('tips.pleaseEnter')}${this.$t('fConfig.sorts')}`));
        }
    };
    return {
      page: new Page(),
      projectForm: {
        controllableDelay: '',
        deliveryDelay: '',
        generalDelay: '',
        planTimeContent: '',
        remarks: '',
        riskContent: '',
        seriousDelay: '',
        sorts: 0,
        orgId: this.$utils.Auth.hasUserInfo().orgId,
        parentSubOrgId: this.$utils.Auth.hasUserInfo().parentSubOrgId,
        createTime: this.$utils.commonUtil.formatTime(new Date()),
        createByName: this.$utils.Auth.hasUserInfo().userName
      },
      sorts: 0,
      customRules: {
          sorts: [{required: true, validator: sortsValid, trigger: 'blur' }]
      }
    };
  },
  props: {
    processParmas: {
      type: Object,
      default: () => { }
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (!this.id) {
        this.$store.dispatch('durationRiskConfig/getSortsMax').then((res) => {
          this.sorts = res.results || 0;
          this.pageConfig.projectForm.sorts = this.sorts + 1;
        });
      }
    });
  },
  methods: {
    // 获取info数据
    async _getInfoData (id = 0) {
      await this.handleGetInfoData(id, this.page.PageConfig.processParmas.infoUrl);
    },
    // 保存
    handleSave (isProcess = false) {
      this.$refs.editForm.getValidateForm(() => {
        const data = this.$clone(this.pageConfig.projectForm);
        this.handleSaveData(data, isProcess);
      });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
