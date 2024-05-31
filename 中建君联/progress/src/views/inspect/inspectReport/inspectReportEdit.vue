<!--
 * @Author: your name
 * @Date: 2021-04-14 09:37:06
 * @LastEditTime: 2021-04-25 14:55:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\views\inspect\inspectReport\inspectReportEdit.vue
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
                    <template slot="form-inspectTypeValue" slot-scope="{item}">
                        <el-form-item :label="$t(item.label)" :prop="item.prop"  :title="$t(item.label)">
                            <div  class="slot-input">
                                <el-input
                                    :value="$t(pageConfig.projectForm[item.prop])"
                                    :size="item.size || 'small'" clearable disabled readonly>
                                </el-input>
                            </div>
                        </el-form-item>
                    </template>
                </g-edit-form>
                <!-- 评标明细情况 -->
                <div v-if="pageConfigLoading">
                    <div v-for="subTable in pageConfig.subTableConfig" :key="subTable.subTableName">
                        <g-edit-title :title="$t(`inspectReport.${subTable.subTableName}`)">
                            <g-button :operationButtons="subTable.subTableButton" @editTableBut="mainOperateBtnSubTable">
                            </g-button>
                        </g-edit-title>
                        <g-edit-table
                            :ref="subTable.subTableName"
                            :type="type"
                            :isSelection="subTable.isSelection"
                            :tableConfig="subTable.tableList"
                            :subTable='subTable'
                            :getRowClassName="getRowClassName"
                            :delete.sync="deleteList[subTable.subTableName]"
                            @editTableEvent='editTableEvent'>
                            <!-- 任务名称 -->
                            <template slot="edit-table-taskName" slot-scope="{item, scope}">
                                <!-- <span v-if="scope.eId">{{scope[item.prop]}}</span> -->
                                <el-input
                                    size="small" :disabled="item.inputStatus === 'disable'"
                                    :maxlength="Number(item.maxlength)"
                                    v-model.trim="scope[item.prop]" :placeholder="item.placeholder"
                                    :clearable="item.clearable === undefined ? true : item.clearable">
                                </el-input>
                            </template>
                            <!-- 计划完成日期 -->
                            <template slot="edit-table-planFinishedDate" slot-scope="{item, scope}">
                                <!-- <span v-if="scope.eId">{{scope[item.prop] | setDate}}</span> -->
                                <el-date-picker
                                    v-model="scope[item.prop]" :placeholder="item.placeholder"
                                    :size="item.size || 'small'" prefix-icon="icon"
                                    :disabled="item.inputStatus === 'disable'"
                                    type="date" value-format='yyyy-MM-dd HH:mm:ss'
                                    @change="changeTime(scope)"
                                    style="width: 100%;">
                                </el-date-picker>
                            </template>
                            <!-- 实际完成日期 -->
                            <template slot="edit-table-realFinishedDate" slot-scope="{item, scope}">
                                <!-- <span v-if="scope.eId">{{scope[item.prop] | setDate}}</span> -->
                                <el-date-picker
                                    v-model="scope[item.prop]" :placeholder="item.placeholder"
                                    :size="item.size || 'small'" prefix-icon="icon"
                                    :disabled="item.inputStatus === 'disable'"
                                    @change="changeTime(scope)"
                                    type="date" value-format='yyyy-MM-dd HH:mm:ss'
                                    style="width: 100%;">
                                </el-date-picker>
                            </template>
                            <!-- 计划完成进度 -->
                            <template slot="edit-table-planFinishedProgress" slot-scope="{item, scope}">
                                <!-- <span class="smallFont" v-if="scope.eId">{{scope.planFinishedProgress | setFinishedProgress}}</span> -->
                                <el-number
                                     controls-position="right" size="small"
                                    :disabled="item.inputStatus === 'disable'"
                                    :maxlength="Number(item.maxlength)" :precision="2"
                                    v-model.trim="scope[item.prop]" :placeholder="item.placeholder"
                                    :clearable="item.clearable === undefined ? true : item.clearable"
                                    :max="100">
                                </el-number>
                            </template>
                            <!-- 滞后天数 -->
                            <template slot="edit-table-lagDays" slot-scope="{item, scope}">
                                <el-number
                                     controls-position="right" size="small"
                                    :disabled="item.inputStatus === 'disable'"
                                    :maxlength="Number(item.maxlength)" :precision="2"
                                    v-model.trim="scope[item.prop]" :placeholder="item.placeholder"
                                    :clearable="item.clearable === undefined ? true : item.clearable"
                                    :max="100">
                                </el-number>
                            </template>
                            <template slot="edit-table-warnColourValue" slot-scope="{scope}">
                                <span class="smallFont warnColour" :class="scope.warnColourClass">
                                    <!-- {{$t(scope.warnColourValue)}} -->
                                </span>
                            </template>
                        </g-edit-table>
                    </div>
                </div>
            </div>
        </edit-page>

        <!-- 选择人员 -->
        <g-dialog v-if="dialogVisible" :dialogConfig="dialogConfig" :isVisible.sync="dialogVisible">
            <ganttDetail slot="body" slot-scope="{height}" :dialogHeight="height"
                :close.sync="dialogVisible"
                :selectList="selectList"
                :isParentCanCheck="true"
                :projectId="pageConfig.projectForm.projectId"
                varietiesTitle="inspectReport.ganttDetail"
                @getData="getData" v-if="dialogVisible">
            </ganttDetail>
        </g-dialog>
    </div>
</template>
<script>
import Page from './configEdit.js';
import {editPage} from 'mixins/editMixins';
import {importPage} from 'mixins/importMixins';

export default {
    name: 'inspectReportEdit',
    mixins: [editPage, importPage],
    filters: {
        setFinishedProgress(val) {
            if (!val) return 0;
            const progress = val * 100;
            return Number(progress.toFixed(4));
        }
    },
    components: {
        ganttDetail(resolve) {
            require(['components/material/ganttDetail/ganttDetail.vue'], resolve);
        }
    },
    data () {
        return {
            page: new Page(),
            projectForm: {
                attachment: '',
                inspectPosition: '',
                inspectResult: '',
                inspectTypeCode: '01',
                inspectTypeValue: 'inspectReport.inspectTypeValue01',
                inspectUserName: '',
                progressAnalysis: '',
                projectId: '',
                projectName: '',
                remarks: '',
                parentSubOrgId: this.$utils.Auth.hasUserInfo().parentSubOrgId,
                createTime: this.$utils.commonUtil.formatTime(new Date()),
                applyDate: this.$utils.commonUtil.formatTime(new Date()),
                createByName: this.$utils.Auth.hasUserInfo().userName
            },
            dialogVisible: false,
            dialogConfig: {
                title: this.$t('inspectReport.selectTask'),
                appendBody: false,
                center: true,
                top: '50px',
                width: '90%',
                span: '0.75'
            },
            selectList: [],
            tableRow: {
                cid: '',
                eId: '',
                lagDays: '',
                planFinishedDate: '',
                planFinishedProgress: '',
                planInvestResourse: '',
                realFinishedDate: '',
                realFinishedProgress: '',
                realInvestResourse: '',
                remarks: '',
                taskName: '',
                taskNumber: '',
                warnColourCode: '',
                warnColourValue: ''
            },
            importUrl: '/personnel/budget/excel/import',
            that: '',
            setId: '',
            warnColourClass: ''
        };
    },
    props: {
        processParmas: {
            type: Object,
            default: () => {}
        }
    },
    mounted() {
    },
    methods: {
        // 获取info数据
        async _getInfoData(id = 0) {
            this.setId = id;
            await this.handleGetInfoData(id, this.page.PageConfig.processParmas.infoUrl, () => {
                const tableData = this.pageConfig.subTableConfig['progressInspectReportDetail'].tableData;
                for (const item of tableData) {
                    const realFinishedProgress = Number(item.realFinishedProgress || 0) * 100;
                    item.realFinishedProgress = Number(realFinishedProgress.toFixed(4));
                    const planFinishedProgress = Number(item.planFinishedProgress || 0) * 100;
                    item.planFinishedProgress = Number(planFinishedProgress.toFixed(4));
                }
            });
        },
        // 数值计算
        getRowClassName({row}) {
            const lagDays = Number(row.lagDays) || 0;
            // 未滞后，正常颜色；滞后1天，绿色预警；滞后2-4天，蓝色预警；滞后5-9天，黄色预警；滞后10天及以上，红色预警
            if (lagDays < 1) { // 未滞后，正常颜色
                row.warnColourValue = 'inspectReport.warnColourValue01';
                row.warnColourValue = '01';
                row.warnColourClass = '';
            } else if (lagDays >= 1 && lagDays < 2) {// 滞后1天，绿色预警
                row.warnColourValue = 'inspectReport.warnColourValue02';
                row.warnColourValue = '02';
                row.warnColourClass = 'warGreen';
            } else if (lagDays >= 2 && lagDays < 5) {// 滞后2-4天，蓝色预警
                row.warnColourValue = 'inspectReport.warnColourValue03';
                row.warnColourValue = '03';
                row.warnColourClass = 'warBlue';
            } else if (lagDays >= 5 && lagDays < 9) { // 滞后5-9天，黄色预警
                row.warnColourValue = 'inspectReport.warnColourValue04';
                row.warnColourValue = '04';
                row.warnColourClass = 'warYellow';
            } else { // 滞后10天及以上，红色预警
                row.warnColourValue = 'inspectReport.warnColourValue05';
                row.warnColourValue = '05';
                row.warnColourClass = 'warRed';
            }
            return '';
        },
        sysHandleDeletaAdd(tableName) {
            if (!this.pageConfig.projectForm.projectName) {
                this.$message.error(this.$t('tips.pleaseSelectProject'));
                return;
            }
            const row = {
                createTime: this.$utils.commonUtil.formatTime(new Date()),
                cid: '',
                eId: '',
                lagDays: '',
                planFinishedDate: '',
                planFinishedProgress: '',
                planInvestResourse: '',
                realFinishedDate: '',
                realFinishedProgress: '',
                realInvestResourse: '',
                remarks: '',
                taskName: '',
                taskNumber: '',
                warnColourCode: '01',
                warnColourValue: 'inspectReport.warnColourValue01'
            };
            this.pageConfig.subTableConfig[tableName].tableData.push(row);
        },
        // 选择明细
        sysHandleSelectDetail(tableName) {
            if (!this.pageConfig.projectForm.projectName) {
                this.$message.error(this.$t('tips.pleaseSelectProject'));
                return;
            }
            const tableData = this.pageConfig.subTableConfig[tableName].tableData;
            this.selectList = this.$clone(tableData).filter(v => v.eId);
            this.dialogVisible = true;
        },
        // 获取选中的数据
        getData(arr) {
            const data = [];
            for (const item of arr) {
                const alreadyFinishedProgress = Number(item.alreadyFinishedProgress || 0) * 100;
                item.alreadyFinishedProgress = Number(alreadyFinishedProgress.toFixed(4));
                data.push(
                    {
                        createTime: this.$utils.commonUtil.formatTime(new Date()),
                        cid: item.cid,
                        eId: item.id,
                        lagDays: '',
                        planFinishedDate: item.planFinishedDate || '',
                        planFinishedProgress: alreadyFinishedProgress, // 计划完成进度
                        planInvestResourse: '',
                        realFinishedDate: item.realFinishedDate || '',
                        realFinishedProgress: '',
                        realInvestResourse: '',
                        remarks: '',
                        taskName: item.taskName,
                        taskNumber: item.taskName || '',
                        warnColourCode: '01',
                        warnColourValue: 'inspectReport.warnColourValue01'
                    }
                );
            }
            this.setSubTable('progressInspectReportDetail', data);
        },
        setSubTable(tableName, arr) {
           const tableData = this.$clone(this.pageConfig.subTableConfig[tableName].tableData);
            const choiceTableData = tableData.filter(v => v.cid);
            const addTableData = tableData.filter(v => !v.cid);
            const selectTableList = [];
            const newSelectTableList = [];
            if (!choiceTableData.length || !arr.length) {
                this.$set(this.pageConfig.subTableConfig[tableName], 'tableData', arr.concat(addTableData));
            }
            if (choiceTableData.length) {
                for (const item of choiceTableData) {
                    for (const val of arr) {
                        if (item.cid === val.cid) {
                            selectTableList.push(item);
                        }
                    }
                }
                for (const item of arr) {
                    const index = choiceTableData.findIndex(v => v.cid === item.cid);
                    if (index < 0) {
                        newSelectTableList.push(item);
                    }
                }
                this.$set(this.pageConfig.subTableConfig[tableName], 'tableData', selectTableList.concat(newSelectTableList, addTableData));
            }
            this.deletTableCallback(tableName);
            this.dialogVisible = false;
        },
        // 批量删除后的回调
        deletTableCallback(tableName) {
            const mainRiskItem = this.pageConfig.subTableConfig[tableName].tableData.slice(0, 5).map(v => v.riskContent).join(',');
            this.$set(this.pageConfig.projectForm, 'mainRiskItem', mainRiskItem);
        },
        changeTime(row) {
            if (row.planFinishedDate && row.realFinishedDate) {
                row.lagDays = this.GetDateDiff(row.planFinishedDate, row.realFinishedDate);
            } else {
                row.lagDays = '';
            }
        },
        // 计算时间间隔天数
        GetDateDiff(startDate, endDate) {
            const startTime = new Date(startDate).getTime();
            const endTime = new Date(endDate).getTime();
            const time = startTime - endTime;
            const dates = Math.abs((time)) / (1000 * 60 * 60 * 24);
            return time > 0 ? -dates : dates;
        },
        // 保存
        handleSave (isProcess = false) {
            this.$refs.editForm.getValidateForm(() => {
                const data = this.$clone(this.pageConfig.projectForm);
                const details = this.$refs.progressInspectReportDetail[0].validateTableData();
                if (!details || details.length === 0) {
                    // 存在未填写或个数错误的数据
                    this.$message.error(`${this.$t('inspectReport.progressInspectReportDetail')}${this.$t('tips.notFilledIn')}`);
                    return;
                }
                for (const item of details) {
                    const realFinishedProgress = item.realFinishedProgress / 100;
                    item.realFinishedProgress = Number(realFinishedProgress.toFixed(4));
                    const planFinishedProgress = item.planFinishedProgress / 100;
                    item.planFinishedProgress = Number(planFinishedProgress.toFixed(4));
                }
                data.details = details;
                this.handleSaveData(data, isProcess);
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.warnColour {
    width: 18px;
    height: 18px;
    display: inline-block;
    border-radius: 50%;
    position: relative;
    top: 4px;
    background: #24b568;
    &.warGreen {
        background: green;
    }
    &.warBlue {
        background: blue;
    }
    &.warYellow {
        background: yellow;
    }
    &.warRed {
        background: red;
    }
}
</style>
