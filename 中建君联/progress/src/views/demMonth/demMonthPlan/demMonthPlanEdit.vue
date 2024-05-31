<!--
 * @Author: your name
 * @Date: 2021-01-29 17:27:29
 * @LastEditTime: 2022-02-28 16:11:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\views\demMonth\demMonthPlan\demMonthPlanEdit.vue
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
                        <g-edit-title :title="$t(`demMonthPlan.${subTable.subTableName}`)">
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
        <!-- 选择材料分类 -->
        <g-dialog v-if="dialogVisible" :dialogConfig="dialogConfig" :isVisible.sync="dialogVisible">
            <ganttDetail slot="body" slot-scope="{height}" :dialogHeight="height"
                :close.sync="dialogVisible"
                :selectList="selectList"
                varietiesDateilUrl='demMasterPlan/getPlanMonthList'
                :projectId="pageConfig.projectForm.projectId"
                varietiesTitle="demMonthPlan.ganttDetail"
                @getData="getData" v-if="dialogVisible">
            </ganttDetail>
        </g-dialog>
    </div>
</template>
<script>
import Page from './configEdit.js';
import {editPage} from 'mixins/editMixins';

export default {
    name: 'demMonthPlanEdit',
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
                applyMonth: '',
                attachment: '',
                docNo: '',
                flowStatus: '',
                projectId: '',
                remarks: '',
                resourceRequiredPlan: '',
                riskEstimate: '',
                taskOverview: '',
                orgId: this.$utils.Auth.hasUserInfo().orgId,
                parentSubOrgId: this.$utils.Auth.hasUserInfo().parentSubOrgId,
                createTime: this.$utils.commonUtil.formatTime(new Date()),
                createByName: this.$utils.Auth.hasUserInfo().userName
            },
            // 选择材料
            dialogVisible: false,
            dialogConfig: {
                title: this.$t('demMonthPlan.selectTask'),
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
    components: {
        ganttDetail (resolve) {
            require(['views/buildLog/components/ganttDetail/ganttDetail.vue'], resolve);
        }
    },
    methods: {
        // 子表第二层删除
        sysHandleDelete(row, index) {
            console.log(row, 'row');
            const projectDetailName = row.details[index].projectDetailName;
            this.$confirm(`${this.$t('button.delete')} ${projectDetailName}?`, this.$t('button.delete'), {
                confirmButtonText: this.$t('button.determine'),
                cancelButtonText: this.$t('button.close'),
                type: 'warning'
            }).then(() => {
                const details = this.$clone(row.details);
                details.splice(index, 1);
                this.$set(row, 'details', details);
                const tableData = this.$clone(this.pageConfig.subTableConfig['progressMonthPlanDetail'].tableData);
                this.$set(this.pageConfig.subTableConfig['progressMonthPlanDetail'], 'tableData', []);
                this.$set(this.pageConfig.subTableConfig['progressMonthPlanDetail'], 'tableData', tableData);
            }).catch(() => { });
        },
        // 获取info数据
        async _getInfoData(id = 0) {
            await this.handleGetInfoData(id, this.page.PageConfig.processParmas.infoUrl, () => {
                const tableData = this.pageConfig.subTableConfig['progressMonthPlanDetail'].tableData;
                for (const item of tableData) {
                    const currentFinishProgress = item.currentFinishProgress * 100;
                    item.currentFinishProgress = Number(currentFinishProgress.toFixed(4));
                }
            });
        },
        // 校验项目
        handleCheckProject(params) {
            // if (params.selectList.length) {
            //     const data = {
            //         monthPlanId: this.id || '',
            //         projectId: params.selectList[0].id
            //     };
            //     this.$store.dispatch('demMonthPlan/getProjectMaxMonth', data).then(res => {
            //         const results = res.results;
            //         this.$set(this.pageConfig.projectForm, 'applyMonth', results);
            //         this.handleSelect(params, 'projectName');
            //     });
            // } else {
            //     this.handleSelect(params, 'projectName');
            // }
            this.handleSelect(params, 'projectName');
        },
        // 选择明细
        sysHandleSelectDetail(tableName) {
            if (!this.pageConfig.projectForm.projectName) {
                this.$message.error(this.$t('tips.pleaseSelectProject'));
                return;
            }
            if (!this.pageConfig.projectForm.applyMonth) {
                // 请选择填报月份
                this.$message.error(this.$t('demMonthPlan.pleaseSelectApplyMonth'));
                return;
            }
            this.chackProject(tableName);
        },
        // 校验项目是否已做周期
        chackProject(tableName) {
            const data = {
                monthPlanId: this.id || null,
                projectId: this.pageConfig.projectForm.projectId,
                applyMonth: this.pageConfig.projectForm.applyMonth
            };
            this.$store.dispatch('demMonthPlan/checkAreadyProject', data).then(res => {
                if (res.results) {
                    // 该项目已添加此月度需求计划，不能再次添加。
                    this.$message.error(this.$t('demMonthPlan.checkMonthPlanTips'));
                } else {
                    const tableData = this.pageConfig.subTableConfig[tableName].tableData;
                    this.selectList = this.$clone(tableData);
                    this.dialogVisible = true;
                }
            });
        },
        // 获取选中的数据
        getData(arr) {
            const data = [];
            for (const item of arr) {
                for (const child of item.details) {
                    delete child.id;
                    child.currentDetailQuantity = '';
                    child.details = [];
                    // for (const second of child.details) {
                    //   second.dataSourceValue = '主计划';
                    //   second.dataSourceCode = '03';
                    //   second.resourceQuantity = second.quantity;
                    //   second.quantity = '';
                    //   second.gantResourceDetailId = item.id;
                    //   second.cid = second.id;
                    //   delete second.id;
                    //   second.includeTaxAmount = '';
                    //   second.includeUnitPrice = '';
                    //   second.taxAmount = '';
                    //   second.taxRate = '';
                    //   second.excludeTaxAmount = '';
                    //   second.excludeUnitPrice = '';
                    // }
                }
                data.push(
                    {
                        alreadyFinishedProgress: item.alreadyFinishedProgress,
                        cid: item.cid,
                        id: item.id,
                        createTime: this.$utils.commonUtil.formatTime(new Date()),
                        currentFinishProgress: item.currentFinishProgress || '',
                        dutyUserId: item.dutyUserId,
                        dutyUserName: item.dutyUserName,
                        monthPlanId: item.monthPlanId,
                        planDuration: item.planDuration,
                        planFinishContent: '',
                        planStartDate: item.planStartDate,
                        realStartDate: item.realStartDate,
                        remarks: '',
                        taskName: item.taskNameList.join('/'),
                        taskNumber: item.taskNumber || '',
                        details: item.details
                    }
                );
            }
            this.setSubTable('progressMonthPlanDetail', data);
        },
        setSubTable(tableName, arr) {
            const tableData = this.$clone(this.pageConfig.subTableConfig[tableName].tableData);
            const selectTableList = [];
            if (!tableData.length || !arr.length) {
                this.$set(this.pageConfig.subTableConfig[tableName], 'tableData', arr);
            }
            if (tableData.length) {
                for (const item of tableData) {
                    for (const val of arr) {
                        if (item.cid === val.cid) {
                            selectTableList.push(item);
                        }
                    }
                }
                for (const item of arr) {
                    const index = tableData.findIndex(v => v.cid === item.cid);
                    if (index < 0) {
                        selectTableList.push(item);
                    }
                }
                this.$set(this.pageConfig.subTableConfig[tableName], 'tableData', selectTableList);
            }
            this.dialogVisible = false;
        },
        // 保存
        handleSave (isProcess = false) {
            this.$refs.editForm.getValidateForm(() => {
                const data = this.$clone(this.pageConfig.projectForm);
                const progressMonthPlanDetail = this.$refs.progressMonthPlanDetail[0].validateTableData();
                if (!progressMonthPlanDetail || progressMonthPlanDetail.length === 0) {
                    // 存在未填写或个数错误的数据
                    this.$message.error(`${this.$t('demMonthPlan.progressMonthPlanDetail')} ${this.$t('tips.notFilledIn')}`);
                    return;
                }
                console.log(progressMonthPlanDetail, 'progressMonthPlanDetail');
                const taskOverview = data.taskOverview;
                const taskOverviewList = [];
                for (const item of progressMonthPlanDetail) {
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
                data.demMonthPlanDetails = progressMonthPlanDetail;
                this.handleSaveData(data, isProcess);
            });
        }
    }
};
</script>
