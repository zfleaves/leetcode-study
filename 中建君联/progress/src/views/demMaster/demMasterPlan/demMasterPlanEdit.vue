<!--
 * @Author: your name
 * @Date: 2021-01-26 17:35:44
 * @LastEditTime: 2021-01-29 13:55:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\views\demMaster\demMasterPlan\demMasterPlanEdit.vue
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
                    <template slot="form-progressManagerGroupList" slot-scope="{item, pageDisabled}">
                        <el-form-item :label="$t(item.label)" :prop="item.prop"  :title="$t(item.label)">
                            <div class="slot-input">
                                <div class="assginer-items">
                                    <template v-for="(tag, i) in pageConfig.projectForm[item.prop].slice(0,10)">
                                        <el-tag
                                            :key="i" @close="handleCloseManagerGroup(item, tag)"
                                            size="mini" :closable="item.inputStatus !== 'disable' && !pageDisabled"  type="info">
                                            <span>{{tag.userName}}</span>
                                        </el-tag>
                                    </template>
                                    <el-tag type="info" size="mini" v-if="pageConfig.projectForm[item.prop].length > 10">+{{pageConfig.projectForm[item.prop].length - 1}}</el-tag>
                                </div>
                                <div class="set" v-if="item.inputStatus !== 'disable' && !pageDisabled">
                                    <i class="multiple-choice-icon iconfont icon-menu" @click="handleSelectManagerGroup(item)"></i>
                            </div>
                            </div>
                        </el-form-item>
                    </template>
                    <template slot="form-demMasterPlanGants" slot-scope="{item}">
                        <el-form-item :label="$t(item.label)" :prop="item.prop"  :title="$t(item.label)">
                            <span class="midFont set" @click="handleEditPlan(item)">点击查看</span>
                        </el-form-item>
                    </template>
                </g-edit-form>
            </div>
        </edit-page>

        <!-- 选择收入合同汇总 -->
        <g-dialog v-if="userFlag" :dialogConfig="userDialogConfig" :isVisible.sync="userFlag">
            <organizationUserTable slot="body" slot-scope="{height}" :dialogHeight="height"
                :selectedUsers="pageConfig.projectForm.progressManagerGroupList || []"
                choice="isCheckbox"
                :close.sync="userFlag" @selectUser="getUser" v-if="userFlag">
            </organizationUserTable>
    </g-dialog>
    </div>
</template>
<script>
import Page from './configEdit.js';
import {editPage} from 'mixins/editMixins';

export default {
    name: 'demMasterPlanEdit',
    mixins: [editPage],
    components: {
        // 选人
        organizationUserTable(resolve) {
            require(['components/basicComponents/userDialog/organizationUserTable'], resolve);
        }
        // taskDetail(resolve) {
        //   require(['../components/taskDetail/taskDetail.vue'], resolve);
        // }
    },
    data () {
        return {
            page: new Page(),
            projectForm: {
                'attachment': '',
                'docNo': '',
                'flowStatus': '',
                'guaranteeAttachment': '',
                'planFinishedDate': '',
                'planStartDate': '',
                'progressManagerGroup': '',
                progressManagerGroupId: '',
                progressManagerGroupList: [],
                'projectId': '',
                'projectName': '',
                'remarks': '',
                'riskAnalysis': '',
                // 'versionNumber': 1,
                orgId: this.$utils.Auth.hasUserInfo().orgId,
                parentSubOrgId: this.$utils.Auth.hasUserInfo().parentSubOrgId,
                createTime: this.$utils.commonUtil.formatTime(new Date()),
                createByName: this.$utils.Auth.hasUserInfo().userName
            },
            // 选择任务
            userFlag: false,
            userDialogConfig: {
                title: this.$t('dialog.selectUser'),
                appendBody: false,
                center: true,
                top: '80px',
                width: '80%',
                span: '0.7'
            }
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
            await this.handleGetInfoData(id, this.page.PageConfig.processParmas.infoUrl);
        },
        // 获取数据
        handleGetInfoData(id = 0, infoUrl, callback) {
            if (Number(id) === 0) {
                this.pageConfig.projectForm = this.projectForm; // 挂载form 对象
                this.pageConfigLoading = true;
                return;
            }
            this.id = id;
            this.loading = true;
            this.$store.dispatch(infoUrl.url, {[infoUrl.params]: this.id}).then(res => {
                const results = this.$clone(res.results);
                if (!results) {
                    this.pageConfig = this.page.PageConfig;
                    this.pageConfig.projectForm = this.projectForm; // 挂载form 对象
                    this.pageConfigLoading = true;
                    this.loading = false;
                    return;
                }
                this.pageConfig = this.page.PageConfig;
                const progressManagerGroup = results.progressManagerGroup;
                const progressManagerGroupList = [];
                if (progressManagerGroup) {
                    const list = progressManagerGroup.split(',');
                    const listId = results.progressManagerGroupId.split(',');
                    if (list.length) {
                        for (const i in list) {
                            progressManagerGroupList.push({
                                id: Number(listId[i]),
                                userName: list[i]
                            });
                        }
                    }
                }
                console.log(progressManagerGroupList, 'progressManagerGroupList');
                this.$set(results, 'progressManagerGroupList', progressManagerGroupList);
                this.$set(this.pageConfig, 'projectForm', results);
                this.oldProjectForm = this.$clone(results);
                this.pageConfigLoading = true;
                this.loading = false;
            });
        },
        // 校验项目
        handleCheckProject(params) {
            if (params.selectList.length) {
                const data = {
                    masterPlanId: this.id || '',
                    projectId: params.selectList[0].id
                };
                this.$store.dispatch('demMasterPlan/checkAreadyProject', data).then(res => {
                    if (res.results) {
                        // 该项目已添加施工总预算，不能再次添加。
                        this.$message.error(this.$t('demMasterPlan.checkProjectTips'));
                    } else {
                        this.handleSelect(params, 'projectName');
                    }
                });
            } else {
                this.handleSelect(params, 'projectName');
            }
        },
        // 保存
        handleSave (isProcess = false) {
            console.log(this.pageConfig, 'pageConfig');
            this.$refs.editForm.getValidateForm(() => {
                const data = this.$clone(this.pageConfig.projectForm);
                if (data.progressManagerGroupList.length) {
                    data.progressManagerGroup = data.progressManagerGroupList.map(v => v.userName).join(',');
                    data.progressManagerGroupId = data.progressManagerGroupList.map(v => v.id).join(',');
                }
                this.handleSaveData(data, isProcess);
            });
        },
        // 点击查看 计划
        handleEditPlan() {
            if (this.type === 'add' || this.pageConfig.projectForm.demMasterPlanGants.length === 0) {
                this.$message.error(this.$t('dialog.viewGantt'));
                return;
            }
            // console.log(row, row);
            const type = this.$base64.encode('info');
            const id = this.$base64.encode(this.id || 0);
            this.$router.push(`/ganttPage/${type}/${id}/demMasterPlan`);
        },
        //  ----------------- 项目管理小组 --------------------------
        handleCloseManagerGroup(item, tag) {
            const progressManagerGroupList = this.pageConfig.projectForm.progressManagerGroupList;
            progressManagerGroupList.splice(progressManagerGroupList.indexOf(tag), 1);
        },
        handleSelectManagerGroup() {
            this.userFlag = true;
        },
        getUser(arr) {
            this.$set(this.pageConfig.projectForm, 'progressManagerGroupList', arr);
            this.userFlag = false;
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
