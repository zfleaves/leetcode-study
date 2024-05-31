<!--
 * @Author: your name
 * @Date: 2021-01-29 17:27:54
 * @LastEditTime: 2022-03-03 13:49:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\views\demMonth\demMonthPlanAdjust\demMonthPlanAdjustEdit.vue
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
                </g-edit-form>
                <!-- 明细清单 -->
                <div v-if="pageConfigLoading">
                    <div v-for="subTable in pageConfig.subTableConfig" :key="subTable.subTableName">
                        <g-edit-title :title="$t(`demMonthPlanAdjust.${subTable.subTableName}`)">
                            <g-button :operationButtons="subTable.subTableButton" @editTableBut="mainOperateBtnSubTable">
                            </g-button>
                        </g-edit-title>
                        <g-edit-table
                            :ref="subTable.subTableName"
                            :type="type"
                            :isSelection="subTable.isSelection"
                            :tableConfig="subTable.tableList"
                            :subTable='subTable'
                            :customRules="subTableCustomRules"
                            :delete.sync="deleteList[subTable.subTableName]"
                            @editTableEvent='editTableEvent'>
                            <template slot="edit-table-alreadyFinishedProgress" slot-scope="{scope}">
                                <span class="smallFont">{{scope.alreadyFinishedProgress | setFinishedProgress}}</span>
                            </template>
                            <template slot="edit-table-oldCurrentFinishProgress" slot-scope="{scope}">
                                <span class="smallFont">{{scope.oldCurrentFinishProgress | setFinishedProgress}}</span>
                            </template>
                            <template slot="edit-table-currentFinishProgress" slot-scope="{item, scope}">
                                <el-number
                                     controls-position="right" size="small"
                                    :disabled="item.inputStatus === 'disable'"
                                    :maxlength="Number(item.maxlength)" :precision="Number(item.precision)"
                                    v-model.trim="scope[item.prop]" :placeholder="item.placeholder"
                                    :clearable="item.clearable === undefined ? true : item.clearable"
                                    :max="100" :min="scope.alreadyFinishedProgress * 100">
                                </el-number>
                            </template>
                        </g-edit-table>
                    </div>
                </div>
            </div>
        </edit-page>
    </div>
</template>
<script>
import Page from './configEdit.js';
import {editPage} from 'mixins/editMixins';

export default {
    name: 'demMonthPlanAdjustEdit',
    mixins: [editPage],
    filters: {
        setFinishedProgress(val) {
            if (!val) return 0;
            const progress = val * 100;
            return Number(progress.toFixed(4));
        }
    },
    data () {
        const numValid = (rule, value, callback) => {
            if (!value) {
                callback(new Error(`${this.$t('dialog.currentFinishProgress')} ${this.$t('tips.numTips')}`));
            } else {
                callback();
            }
        };
        return {
            page: new Page(),
            projectForm: {
                adjustReason: '',
                adjustTypeCode: '',
                adjustTypeValue: '',
                adjustCount: '',
                applyMonth: '',
                attachment: '',
                docNo: '',
                monthPlanId: 0,
                projectId: '',
                remarks: '',
                orgId: this.$utils.Auth.hasUserInfo().orgId,
                parentSubOrgId: this.$utils.Auth.hasUserInfo().parentSubOrgId,
                createTime: this.$utils.commonUtil.formatTime(new Date()),
                createByName: this.$utils.Auth.hasUserInfo().userName
            },
            // 选择材料
            dialogVisible: false,
            dialogConfig: {
                title: this.$t('demMonthPlanAdjust.selectTask'),
                appendBody: false,
                center: true,
                top: '50px',
                width: '80%',
                span: '0.75'
            },
            varietiesIdList: [],
            selectList: [],
            back: '',
            subTableRow: {},
            subTableCustomRules: {
                currentFinishProgress: [{required: true, validator: numValid, trigger: 'blur' }]
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
                const tableData = this.pageConfig.subTableConfig['progressMonthPlanAdjustDetail'].tableData;
                for (const item of tableData) {
                    const currentFinishProgress = item.currentFinishProgress * 100;
                    item.currentFinishProgress = Number(currentFinishProgress.toFixed(4));
                }
            });
        },
        // 校验项目
        handleCheckProject(params) {
            this.handleSelect(params, 'projectName', () => {
                if (params.selectList.length === 0) {
                    this.$set(this.pageConfig.projectForm, 'projectCode', '');
                }
            });
        },
        // 选择明细
        sysHandleSelectDetail(tableName) {
            if (!this.pageConfig.projectForm.projectName) {
                this.$message.error(this.$t('tips.pleaseSelectProject'));
                return;
            }
            if (!this.pageConfig.projectForm.applyMonth) {
                // 请选择填报月份
                this.$message.error(this.$t('demMonthPlanAdjust.pleaseSelectApplyMonth'));
                return;
            }
            this.chackProject(tableName);
        },
        // 校验项目是否已做周期
        chackProject(tableName) {
            const data = {
                monthPlanAdjustId: this.id || null,
                projectId: this.pageConfig.projectForm.projectId,
                applyMonth: this.pageConfig.projectForm.applyMonth
            };
            this.$store.dispatch('demMonthPlanAdjust/checkAreadyProject', data).then(res => {
                if (res.results) {
                    // 该项目已添加此月度需求计划，不能再次添加。
                    this.$message.error(this.$t('demMonthPlanAdjust.checkMonthPlanTips'));
                } else {
                    const tableData = this.pageConfig.subTableConfig[tableName].tableData;
                    // this.selectList = this.$clone(tableData);
                    if (tableData.length === 0) {
                       this.getDetails(tableName);
                       return;
                    }
                    const messageTips = this.$t('demMonthPlanAdjust.getDetailTips');
                    this.$confirm(messageTips, this.$t('demMonthPlanAdjust.getDetail'), {
                        confirmButtonText: this.$t('button.determine'),
                        cancelButtonText: this.$t('button.close'),
                        type: 'warning'
                    })
                    .then(() => {
                        this.getDetails(tableName);
                    })
                    .catch(() => {});
                }
            });
        },
        // 获取明细
        async getDetails(tableName) {
            const countRes = await this.$store.dispatch('demMonthPlanAdjust/getAdjustMonthCounts', {projectId: this.pageConfig.projectForm.projectId});
            this.$set(this.pageConfig.projectForm, 'adjustCount', countRes.results);
            const data = {
                projectId: this.pageConfig.projectForm.projectId,
                applyMonth: this.pageConfig.projectForm.applyMonth
            };
            this.$store.dispatch('demMonthPlanAdjust/getProjectMonthInfo', data).then(res => {
                if (!res.results || res.results.length === 0) {
                    this.$message.error(this.$t('demMonthPlanAdjust.getProjectMonthInfo'));
                    this.$set(this.pageConfig.projectForm, 'adjustCount', '');
                    this.$set(this.pageConfig.projectForm, 'projectId', '');
                    this.$set(this.pageConfig.projectForm, 'projectName', '');
                    this.$set(this.pageConfig.projectForm, 'projectCode', '');
                    return;
                }
                this.$set(this.pageConfig.projectForm, 'monthPlanId', res.results[0].id);
                const results = res.results[0].demMonthPlanDetails;
                for (const item of results) {
                    item.eId = item.id;
                    delete item.id;
                    item.remarks = '';
                    item.oldCurrentFinishProgress = item.currentFinishProgress;
                    const currentFinishProgress = item.currentFinishProgress * 100;
                    item.currentFinishProgress = Number(currentFinishProgress.toFixed(4));
                    for (const child of item.details) {
                        child.beforeAdjustDetailQuantity = child.currentDetailQuantity;
                        child.monthPlanResourceId = child.id;
                        delete child.id;
                    }
                }
                this.$set(this.pageConfig.subTableConfig[tableName], 'tableData', results);
            });
        },
        // 保存
        handleSave (isProcess = false) {
            this.$refs.editForm.getValidateForm(() => {
                const data = this.$clone(this.pageConfig.projectForm);
                const progressMonthPlanAdjustDetail = this.$refs.progressMonthPlanAdjustDetail[0].validateTableData();
                if (!progressMonthPlanAdjustDetail || progressMonthPlanAdjustDetail.length === 0) {
                    // 存在未填写或个数错误的数据
                    this.$message.error(`${this.$t('demMonthPlanAdjust.progressMonthPlanAdjustDetail')} ${this.$t('tips.notFilledIn')}`);
                    return;
                }
                console.log(progressMonthPlanAdjustDetail, 'progressMonthPlanAdjustDetail');
                const taskOverview = data.taskOverview;
                const taskOverviewList = [];
                for (const item of progressMonthPlanAdjustDetail) {
                    if (!taskOverview) {
                        const taskOverviewItem = `${item.taskName}(${item.currentFinishProgress}%)`;
                        taskOverviewList.push(taskOverviewItem);
                    }
                    const currentFinishProgress = item.currentFinishProgress / 100;
                    item.currentFinishProgress = Number(currentFinishProgress.toFixed(4));
                }
                if (!taskOverview) {
                    data.taskOverview = taskOverviewList.join(',');
                }
                data.demMonthPlanAdjustDetails = progressMonthPlanAdjustDetail;
                this.handleSaveData(data, isProcess);
            });
        }
    }
};
</script>
