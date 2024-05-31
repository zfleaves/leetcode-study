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
                    <template slot="form-progressTaskName" slot-scope="{item, pageDisabled}">
                        <el-form-item :label="$t(item.label)" :prop="item.prop"  :title="$t(item.label)">
                            <div  class="slot-input">
                                <el-input
                                    v-model.trim="pageConfig.projectForm[item.prop]"
                                    :size="item.size || 'small'"
                                    clearable :disabled="item.inputStatus === 'disable'" readonly>
                                    <template slot="suffix" v-if="item.inputStatus !== 'disable' && !pageDisabled">
                                        <i v-if="projectForm[item.prop]" class="slot-close el-icon-circle-close" @click="handleClearTaskName(item)"></i>
                                        <i class="multiple-choice-icon iconfont icon-menu" @click="handleSelectTaskName(item)"></i>
                                    </template>
                                </el-input>
                            </div>
                        </el-form-item>
                    </template>
                </g-edit-form>
            </div>
        </edit-page>

        <!-- 选择收入合同汇总 -->
        <g-dialog v-if="dialogVisible" :dialogConfig="dialogConfig" :isVisible.sync="dialogVisible">
            <taskDetail slot="body" slot-scope="{height}" :dialogHeight="height"
                :selectId='pageConfig.projectForm.progressTaskId || 0'
                :projectId="pageConfig.projectForm.projectId|| ''"
                :close.sync="dialogVisible" @getData="getTaskName" v-if="dialogVisible">
            </taskDetail>
        </g-dialog>
    </div>
</template>
<script>
import Page from './configEdit.js';
import {editPage} from 'mixins/editMixins';

export default {
    name: 'imageProgressOtherEdit',
    mixins: [editPage],
    components: {
        taskDetail(resolve) {
          require(['../components/taskDetail/taskDetail.vue'], resolve);
        }
    },
    data () {
        return {
            page: new Page(),
            projectForm: {
                'applyDate': '',
                'attachment': '',
                'docNo': '',
                'imageProgressDescription': '',
                'progressTaskId': 0,
                'progressTaskName': '',
                'projectId': '',
                'projectName': '',
                'remarks': '',
                orgId: this.$utils.Auth.hasUserInfo().orgId,
                parentSubOrgId: this.$utils.Auth.hasUserInfo().parentSubOrgId,
                createTime: this.$utils.commonUtil.formatTime(new Date()),
                createByName: this.$utils.Auth.hasUserInfo().userName
            },
            // 选择任务
            dialogVisible: false,
            dialogConfig: {
                title: this.$t('imageProgressOther.seleTaskName'),
                appendBody: false,
                center: true,
                top: '50px',
                width: '60%',
                span: '0.75'
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
        },
        //  ----------------- 任务名称 --------------------------
        handleClearTaskName() {
            this.$set(this.pageConfig.projectForm, 'progressTaskCid', '');
            this.$set(this.pageConfig.projectForm, 'progressTaskId', '');
            this.$set(this.pageConfig.projectForm, 'progressTaskName', '');
        },
        handleSelectTaskName() {
            if (!this.pageConfig.projectForm.projectName) {
                this.$message.error(this.$t('tips.pleaseSelectProject'));
                return;
            }
            this.dialogVisible = true;
        },
        getTaskName(arr) {
            this.$set(this.pageConfig.projectForm, 'progressTaskCid', arr.length ? arr[0].cid : '');
            this.$set(this.pageConfig.projectForm, 'progressTaskId', arr.length ? arr[0].id : '');
            this.$set(this.pageConfig.projectForm, 'progressTaskName', arr.length ? arr[0].taskName : '');
            this.dialogVisible = false;
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
