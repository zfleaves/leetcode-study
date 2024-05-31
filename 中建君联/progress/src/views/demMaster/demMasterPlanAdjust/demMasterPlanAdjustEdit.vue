<!--
 * @Author: your name
 * @Date: 2021-01-28 09:03:58
 * @LastEditTime: 2021-05-20 18:12:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\views\demMaster\demMasterPlanAdjust\demMasterPlanAdjustEdit.vue
-->
<template>
    <div>
        <edit-page @editEvent="editEvent" v-loading="loading">
            <div slot="editPage">
                <g-edit-form
                    ref="editForm"
                    v-if="pageConfigLoading"
                    :type="type"
                    :tableConfig="pageConfig.mainFormConfig"
                    :projectForm="pageConfig.projectForm"
                    @editFormEvent="editFormEvent">
                    <template slot="form-demMasterPlanGants" slot-scope="{item}">
                        <el-form-item :label="$t(item.label)" :prop="item.prop"  :title="$t(item.label)">
                            <span class="midFont set" @click="handleEditPlan(item)">点击查看</span>
                        </el-form-item>
                    </template>
                </g-edit-form>
            </div>
        </edit-page>
    </div>
</template>
<script>
import Page from './configEdit.js';
import {editPage} from 'mixins/editMixins';

export default {
    name: 'demMasterPlanEdit',
    mixins: [editPage],
    data () {
        return {
            page: new Page(),
            projectForm: {
                'adjustReason': '',
                'attachment': '',
                'beforePlanFinishedDate': '',
                'beforePlanStartDate': '',
                'beforeVersionNumber': '',
                'docNo': '',
                'flowStatus': '',
                'masterPlanId': '',
                'planFinishedDate': '',
                'planStartDate': '',
                'projectId': '',
                'projectName': '',
                'remarks': '',
                // 'versionNumber': 1,
                orgId: this.$utils.Auth.hasUserInfo().orgId,
                parentSubOrgId: this.$utils.Auth.hasUserInfo().parentSubOrgId,
                createTime: this.$utils.commonUtil.formatTime(new Date()),
                createByName: this.$utils.Auth.hasUserInfo().userName
            },
            versionNumber: ''
        };
    },
    props: {
        processParmas: {
            type: Object,
            default: () => {}
        }
    },
    methods: {
        // 获取info数据
        async _getInfoData(id = 0) {
            await this.handleGetInfoData(id, this.page.PageConfig.processParmas.infoUrl, () => {
                const beforeVersionNumber = this.pageConfig.projectForm.beforeVersionNumber;
                this.$set(this.pageConfig.projectForm, 'beforeVersionNumber', `V${beforeVersionNumber}.0`);
            });
        },
        // 校验项目
        handleCheckProject(params) {
            if (params.selectList.length) {
                const data = {
                    masterPlanAdjustId: this.id || '',
                    projectId: params.selectList[0].id
                };
                this.$store.dispatch('demMasterPlanAdjust/checkAreadyProject', data).then(res => {
                    if (res.results) {
                        // 该项目已添加施工总预算，不能再次添加。
                        this.$message.error(this.$t('demMasterPlanAdjust.checkProjectTips'));
                    } else {
                        this.handleSelect(params, 'projectName');
                        this.$store.dispatch('demMasterPlanAdjust/getProjectMainInfo', { projectId: params.selectList[0].id}).then(ret => {
                            // console.projectId
                            if (ret.results.length === 0) {
                                this.$message.error(this.$t('demMasterPlanAdjust.noProjectTips'));
                                this.$set(this.pageConfig.projectForm, 'projectId', '');
                                this.$set(this.pageConfig.projectForm, 'projectName', '');
                                this.$set(this.pageConfig.projectForm, 'projectCode', '');
                                this.$set(this.pageConfig.projectForm, 'masterPlanId', '');
                                this.$set(this.pageConfig.projectForm, 'beforeVersionNumber', '');
                                this.$set(this.pageConfig.projectForm, 'beforePlanStartDate', '');
                                this.$set(this.pageConfig.projectForm, 'beforePlanFinishedDate', '');
                                return;
                            }
                            const results = ret.results && ret.results.length ? ret.results[0] : {};
                            console.log(results, 'results');
                            this.$set(this.pageConfig.projectForm, 'masterPlanId', results.id);
                            this.versionNumber = results.versionNumber;
                            this.$set(this.pageConfig.projectForm, 'beforeVersionNumber', `V${results.versionNumber}.0`);
                            this.$set(this.pageConfig.projectForm, 'beforePlanStartDate', results.planStartDate);
                            this.$set(this.pageConfig.projectForm, 'beforePlanFinishedDate', results.planFinishedDate);
                            console.log(this.pageConfig.projectForm, 'projectForm');
                        });
                    }
                });
            } else {
                this.handleSelect(params, 'projectName');
                this.$set(this.pageConfig.projectForm, 'masterPlanId', '');
                this.$set(this.pageConfig.projectForm, 'beforeVersionNumber', '');
                this.$set(this.pageConfig.projectForm, 'beforePlanStartDate', '');
                this.$set(this.pageConfig.projectForm, 'beforePlanFinishedDate', '');
            }
        },
        // 保存
        handleSave (isProcess = false) {
            console.log(this.pageConfig, 'pageConfig');
            this.$refs.editForm.getValidateForm(() => {
                const data = this.$clone(this.pageConfig.projectForm);
                data.beforeVersionNumber = this.versionNumber;
                this.handleSaveData(data, isProcess);
            });
        },
        // 点击查看 计划
        handleEditPlan() {
            if (this.type === 'add' || this.pageConfig.projectForm.demMasterPlanGants.length === 0) {
                this.$message.error(this.$t('dialog.viewGantt'));
                return;
            }
            const type = this.$base64.encode('info');
            const id = this.$base64.encode(this.id || 0);
            this.$router.push(`/ganttPage/${type}/${id}/demMasterPlanAdjust`);
        },
        // 保存数据
        saveData(data, isProcess, callback) {
            const saveUrl = this.page.PageConfig.processParmas.saveUrl;
            this.$store.dispatch(saveUrl.url, data).then(res => {
                const status = this.type === 'add' ? this.$t('button.add') : this.$t('button.edit');
                if (res.status === 0) {
                    if (!isProcess) {
                    if (this.isSumbitSave) { // 是否是保存流程后提交
                        this.handleStartProcess(data, res.results.id); // 传入ID
                        this.$message.success(`${status}${this.$t('tips.success')}!`);
                    } else {
                        this.$message.success(`${status}${this.$t('tips.success')}!`);
                        this.setRoute();
                        return;
                    }
                    }
                    callback && callback();
                } else {
                    this.$message.error(`${status}${this.$t('tips.fail')}!${this.$t(`exception.${res.errorCode}`)}`);
                }
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
        flex:1
    }
}
.slot-input {
  display: flex;
  justify-content: space-between;
  .assginer-items {
    flex: 1;
    /deep/ .el-tag--mini {
      margin-right: 8px;
    }
  }
  .set {
    width: 16px;
  }
}
</style>
