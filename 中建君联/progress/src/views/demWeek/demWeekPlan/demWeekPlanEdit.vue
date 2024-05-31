<!--
 * @Author: your name
 * @Date: 2021-02-01 17:09:24
 * @LastEditTime: 2022-03-02 14:25:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\views\demWeek\demWeekPlan\demWeekPlanEdit.vue
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
                        <g-edit-title :title="$t(`demWeekPlan.${subTable.subTableName}`)">
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
                varietiesDateilUrl='demMasterPlan/getPlanWeekList'
                :projectId="pageConfig.projectForm.projectId"
                varietiesTitle="demWeekPlan.ganttDetail"
                @getData="getData" v-if="dialogVisible">
            </ganttDetail>
        </g-dialog>
    </div>
</template>
<script>
import Page from './configEdit.js';
import {editPage} from 'mixins/editMixins';

export default {
    name: 'demWeekPlanEdit',
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
                callback(new Error(`${this.$t('demWeekPlan.currentFinishProgress')} ${this.$t('tips.numTips')}`));
            } else {
                callback();
            }
        };
        return {
            page: new Page(),
            projectForm: {
                applyDate: '',
                applyWeek: '',
                attachment: '',
                docNo: '',
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
                title: this.$t('demWeekPlan.selectTask'),
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
            },
            week: 1
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
                const tableData = this.$clone(this.pageConfig.subTableConfig['progressWeekPlanDetail'].tableData);
                this.$set(this.pageConfig.subTableConfig['progressWeekPlanDetail'], 'tableData', []);
                this.$set(this.pageConfig.subTableConfig['progressWeekPlanDetail'], 'tableData', tableData);
            }).catch(() => { });
        },
        // 获取info数据
        async _getInfoData(id = 0) {
            await this.handleGetInfoData(id, this.page.PageConfig.processParmas.infoUrl, () => {
                this.$nextTick(() => {
                    const index = this.pageConfig.mainFormConfig.formList.findIndex(v => v.prop === 'applyDate');
                    this.$refs.editForm.weekChange(this.pageConfig.mainFormConfig.formList[index], this.pageConfig.projectForm.applyDate);
                });
                const tableData = this.pageConfig.subTableConfig['progressWeekPlanDetail'].tableData;
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
                    this.$set(this.pageConfig.projectForm, 'applyDate', '');
                }
            });
        },
        // 选择明细
        sysHandleSelectDetail(tableName) {
            if (!this.pageConfig.projectForm.projectName) {
                this.$message.error(this.$t('tips.pleaseSelectProject'));
                return;
            }
            if (!this.pageConfig.projectForm.applyDate) {
                // 请选择填报周期
                this.$message.error(this.$t('demWeekPlan.pleaseSelectApplyWeek'));
                return;
            }
            // if (this.back) {
            //     this.$message.error(this.$t('weekPlan.backTips'));
            //     return;
            // }
            this.chackProject(tableName);
        },
        // 校验项目是否已做周期
        chackProject(tableName) {
            this.week = this.getWeekInMonth(new Date(this.pageConfig.projectForm.applyDate));
            const data = {
                weekPlanId: this.id || null,
                projectId: this.pageConfig.projectForm.projectId,
                applyWeek: this.week,
                applyDate: `${this.$utils.commonUtil.formatDate(this.pageConfig.projectForm.applyDate)}`
            };
            this.$store.dispatch('demWeekPlan/checkAreadyProject', data).then(res => {
                if (res.results) {
                    // 该项目已添加此月度需求计划，不能再次添加。
                    this.$message.error(this.$t('demWeekPlan.checkWeekplanTips'));
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
                        weekPlanId: item.weekPlanId,
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
            this.setSubTable('progressWeekPlanDetail', data);
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
        // ------------------------ 计算周 ---------------------------------------
        // 根据日期判断是月的第几周
        getWeekInMonth(t) {
            if (t === undefined || t === '' || t == null) {
            t = new Date();
            } else {
            const _t = new Date();
            _t.setYear(t.getFullYear());
            _t.setMonth(t.getMonth());
            _t.setDate(t.getDate());
            const date = _t.getDate(); // 给定的日期是几号
            _t.setDate(1);
            const d = _t.getDay(); // 1. 得到当前的1号是星期几。
            let fisrtWeekend = d;
            if (d === 0) {
                fisrtWeekend = 1;
                // 1号就是星期天
            } else {
                fisrtWeekend = 7 - d + 1; // 第一周的周未是几号
            }
            if (date <= fisrtWeekend) {
                return 1;
            } else {
                return 1 + Math.ceil((date - fisrtWeekend) / 7);
            }
            }
        },
        // 保存
        handleSave (isProcess = false) {
            this.$refs.editForm.getValidateForm(() => {
                this.week = this.getWeekInMonth(new Date(this.pageConfig.projectForm.applyDate));
                const data = this.$clone(this.pageConfig.projectForm);
                data.applyWeek = this.week;
                data.applyDate = `${data.applyDate} 00:00:00`;
                // 申请周标识
                data.applyWeekIdentify = this.getDateWeek(data.applyDate, data.applyWeek);
                const progressWeekPlanDetail = this.$refs.progressWeekPlanDetail[0].validateTableData();
                if (!progressWeekPlanDetail || progressWeekPlanDetail.length === 0) {
                    // 存在未填写或个数错误的数据
                    this.$message.error(`${this.$t('demWeekPlan.progressWeekPlanDetail')} ${this.$t('tips.notFilledIn')}`);
                    return;
                }
                const taskOverview = data.taskOverview;
                const taskOverviewList = [];
                for (const item of progressWeekPlanDetail) {
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
                data.demWeekPlanDetails = progressWeekPlanDetail;
                this.handleSaveData(data, isProcess);
            });
        },
        // 通过日期获取第几周
        getDateWeek(date, week) {
            const year = date.slice(0, 4); // 获取年
            const month = date.slice(5, 7); // 获取年
            const weekIdentify = `${year}-${month}-${week}`;
            return weekIdentify;
        }
    }
};
</script>
