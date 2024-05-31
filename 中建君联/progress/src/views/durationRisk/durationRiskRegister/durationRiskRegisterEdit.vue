<!--
 * @Author: your name
 * @Date: 2021-04-14 09:40:54
 * @LastEditTime: 2021-04-15 17:57:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\views\durationRisk\durationRiskRegister\durationRiskRegisterEdit.vue
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
                <!-- 评标明细情况 -->
                <div v-if="pageConfigLoading">
                    <div v-for="subTable in pageConfig.subTableConfig" :key="subTable.subTableName">
                        <g-edit-title :title="$t(`durationRiskRegister.${subTable.subTableName}`)">
                            <g-button :operationButtons="subTable.subTableButton" @editTableBut="mainOperateBtnSubTable">
                            </g-button>
                        </g-edit-title>
                        <g-edit-table
                            :ref="subTable.subTableName"
                            :type="type"
                            :isSelection="subTable.isSelection"
                            :tableConfig="subTable.tableList"
                            :subTable='subTable'
                            :delete.sync="deleteList[subTable.subTableName]"
                            @editTableEvent='editTableEvent'>
                            <!-- 风险内容 -->
                            <template slot="edit-table-riskContent" slot-scope="{item, scope}">
                                <span v-if="scope.eId">{{scope[item.prop]}}</span>
                                <el-input
                                    v-else size="small" :disabled="item.inputStatus === 'disable'"
                                    :maxlength="Number(item.maxlength)"
                                    @change="deletTableCallback(subTable.subTableName)"
                                    v-model="scope[item.prop]" :placeholder="item.placeholder"
                                    :clearable="item.clearable === undefined ? true : item.clearable">
                                </el-input>
                            </template>
                            <!-- 计划时间 -->
                            <template slot="edit-table-planTimeContent" slot-scope="{item, scope}">
                                <span v-if="scope.eId">{{scope[item.prop]}}</span>
                                <el-input
                                    v-else size="small" :disabled="item.inputStatus === 'disable'"
                                    :maxlength="Number(item.maxlength)"
                                    v-model="scope[item.prop]" :placeholder="item.placeholder"
                                    :clearable="item.clearable === undefined ? true : item.clearable">
                                </el-input>
                            </template>
                        </g-edit-table>
                    </div>
                </div>
            </div>
        </edit-page>

        <!-- 选择人员 -->
        <g-dialog v-if="dialogVisible" :dialogConfig="dialogConfig" :isVisible.sync="dialogVisible">
            <durationRiskDetail slot="body" slot-scope="{height}" :dialogHeight="height"
                :close.sync="dialogVisible"
                :selectList="selectList"
                :currentOrgId='pageConfig.projectForm.currentOrgId || 0'
                @getData="getData" v-if="dialogVisible">
            </durationRiskDetail>
        </g-dialog>
    </div>
</template>
<script>
import Page from './configEdit.js';
import {editPage} from 'mixins/editMixins';
import {importPage} from 'mixins/importMixins';

export default {
    name: 'durationRiskRegisterEdit',
    mixins: [editPage, importPage],
    components: {
        durationRiskDetail(resolve) {
          require(['../components/durationRiskDetail/durationRiskDetail.vue'], resolve);
        }
    },
    data () {
        return {
            page: new Page(),
            projectForm: {
                attachment: '',
                docNo: '',
                mainRiskItem: '',
                projectId: '',
                projectName: '',
                remarks: '',
                orgId: this.$utils.Auth.hasUserInfo().orgId,
                parentSubOrgId: this.$utils.Auth.hasUserInfo().parentSubOrgId,
                createTime: this.$utils.commonUtil.formatTime(new Date()),
                applyDate: this.$utils.commonUtil.formatTime(new Date()),
                createByName: this.$utils.Auth.hasUserInfo().userName
            },
            dialogVisible: false,
            dialogConfig: {
                title: this.$t('durationRiskRegister.selectDetail'),
                appendBody: false,
                center: true,
                top: '50px',
                width: '90%',
                span: '0.75'
            },
            selectList: [],
            tableRow: {
                borrowPurpose: '',
                borrowTime: '',
                certificaArchivesId: '',
                certificaHolder: '',
                certificaName: '',
                certificaNumber: '',
                certificaReturnId: '',
                projectName: '',
                remarks: '',
                actualReturnTime: ''
            },
            importUrl: '/personnel/budget/excel/import',
            that: '',
            setId: ''
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
            await this.handleGetInfoData(id, this.page.PageConfig.processParmas.infoUrl);
        },
        sysHandleDeletaAdd(tableName) {
            const row = {
                createTime: this.$utils.commonUtil.formatTime(new Date()),
                remarks: '',
                eId: '',
                delayTimeContent: '',
                planTimeContent: '',
                riskContent: '',
                handerStrategy: ''
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
                data.push(
                    {
                        createTime: this.$utils.commonUtil.formatTime(new Date()),
                        remarks: '',
                        eId: item.eId,
                        delayTimeContent: '',
                        planTimeContent: item.planTimeContent || '',
                        riskContent: item.riskContent || '',
                        handerStrategy: ''
                    }
                );
            }
            this.setSubTable('progressDurationriskRegisterDeta', data);
        },
        setSubTable(tableName, arr) {
           const tableData = this.$clone(this.pageConfig.subTableConfig[tableName].tableData);
            const choiceTableData = tableData.filter(v => v.eId);
            const addTableData = tableData.filter(v => !v.eId);
            const selectTableList = [];
            const newSelectTableList = [];
            if (!choiceTableData.length || !arr.length) {
                this.$set(this.pageConfig.subTableConfig[tableName], 'tableData', arr.concat(addTableData));
            }
            if (choiceTableData.length) {
                for (const item of choiceTableData) {
                    for (const val of arr) {
                        if (item.eId === val.eId) {
                            selectTableList.push(item);
                        }
                    }
                }
                for (const item of arr) {
                    const index = choiceTableData.findIndex(v => v.eId === item.eId);
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
        // 保存
        handleSave (isProcess = false) {
            this.$refs.editForm.getValidateForm(() => {
                const data = this.$clone(this.pageConfig.projectForm);
                const details = this.$refs.progressDurationriskRegisterDeta[0].validateTableData();
                if (!details || details.length === 0) {
                    // 存在未填写或个数错误的数据
                    this.$message.error(`${this.$t('durationRiskRegister.progressDurationriskRegisterDeta')}${this.$t('tips.notFilledIn')}`);
                    return;
                }
                data.details = details;
                this.handleSaveData(data, isProcess);
            });
        }
    }
};
</script>
