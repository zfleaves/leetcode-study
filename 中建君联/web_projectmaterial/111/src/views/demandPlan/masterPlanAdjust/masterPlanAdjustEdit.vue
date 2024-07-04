<!--
 * @Author: your name
 * @Date: 2020-07-27 10:33:48
 * @LastEditTime: 2020-09-22 11:31:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\demandPlan\masterPlanAdjust\masterPlanAdjustEdit.vue
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
                        <g-edit-title :title="$t(`masterPlanAdjust.${subTable.subTableName}`)" :titleTips="$t(`masterPlanAdjust.${subTable.titleTips}`)">
                            <g-button :operationButtons="subTable.subTableButton" @editTableBut="mainOperateBtnSubTable">
                            </g-button>
                        </g-edit-title>
                        <g-edit-pl-table
                            :ref="subTable.subTableName"
                            :type="type"
                            :isSelection="subTable.isSelection"
                            :tableConfig="subTable.tableList"
                            :subTable='subTable'
                            :delete.sync="deleteList[subTable.subTableName]"
                            :customRules="subTableCustomRules"
                            @editTableEvent='editTableEvent'>
                            <template  slot="edit-table-budgetUnitPrice" slot-scope="{item, scope}">
                                <el-number
                                    v-if="(!scope.eId) && item.inputStatus !== 'disable'" size="small"
                                    :disabled="item.inputStatus === 'disable'" :maxlength="Number(item.maxlength)"
                                    :min="0" :precision="item.precision"
                                    @change="handleCalculationUnitPrice(item, scope, subTable)"
                                    v-model.trim="scope[item.prop]" :placeholder="item.placeholder">
                                </el-number>
                                <div v-else style="text-align: center;font-size: 12px;">
                                    {{scope[item.prop] | systemFilters(item)}}
                                </div>
                            </template>
                            <el-button slot="table-buts" size="mini" type="text" class="danger" slot-scope="{scope}"
                            v-if="!scope.eId"
                            :disabled="subTable.isNaNTableMust ? !subTable.isNaNTableMust : !pageDisabled"
                            @click="handleAdjustDetailDelete(scope)">{{$t('button.delete')}}</el-button>
                        </g-edit-pl-table>
                    </div>
                </div>
            </div>
        </edit-page>
        <!-- 选择材料分类 -->
        <g-dialog v-if="dialogVisible" :dialogConfig="dialogConfig" :isVisible.sync="dialogVisible">
            <materialVarieties slot="body" slot-scope="{height}" :dialogHeight="height"
                :close.sync="dialogVisible"
                :selectId="varietiesIdList"
                :doNotCheck="doNotCheckList"
                :selectList="selectList"
                @getData="getData" v-if="dialogVisible">
            </materialVarieties>
        </g-dialog>
    </div>
</template>
<script>
import Page from './configEdit.js';
import {editPage} from 'mixins/editMixins';

export default {
    name: 'masterPlanAdjustEdit',
    mixins: [editPage],
    data () {
        const budgetUnitPriceValid = (rule, value, callback) => {
            if (!value) {
                callback(new Error(this.$t('masterPlanAdjust.budgetUnitPriceValidTips')));
            } else {
                callback();
            }
        };
        return {
            page: new Page(),
            projectForm: {
                attachment: '',
                budgetTotalAmount: 0,
                currencyCode: '',
                currencyValue: '',
                incomeContractCode: '',
                incomeContractId: 0,
                incomeContractName: '',
                partyAUnitId: 0,
                partyAUnitName: '',
                projectId: 0,
                remarks: '',
                masterPlanId: 0,
                orgId: this.$utils.Auth.hasUserInfo().orgId,
                parentSubOrgId: this.$utils.Auth.hasUserInfo().parentSubOrgId,
                createTime: this.$utils.commonUtil.formatTime(new Date()),
                createByName: this.$utils.Auth.hasUserInfo().userName
            },
            dialogVisible: false,
            dialogConfig: {
                title: this.$t('masterPlanAdjust.seleMaterialVarieties'),
                appendBody: false,
                center: true,
                top: '50px',
                width: '80%',
                span: '0.75'
            },
            varietiesIdList: [],
            selectList: [],
            doNotCheckList: [],
            subTableCustomRules: {
                // budgetUnitPrice: [{required: true, validator: budgetUnitPriceValid, trigger: 'blur' }]
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
        materialVarieties(resolve) {
            require(['components/material/materialVarieties/materialVarieties.vue'], resolve);
        }
    },
    methods: {
        setPageDisabed() {
            this.pageDisabled = false;
        },
        // 获取info数据
        async _getInfoData(id = 0) {
            await this.handleGetInfoData(id, this.page.PageConfig.processParmas.infoUrl);
        },
        // 校验项目
        handleCheckProject(params) {
            if (params.selectList.length) {
                const data = {
                    masterPlanAdjustId: this.id || '',
                    projectId: params.selectList[0].id
                };
                this.$store.dispatch('masterPlanAdjust/checkProject', data).then(res => {
                    if (res.results) {
                        // '该项目存在未审批的施工总预算调整，不能再次添加。'
                        this.$message.error(this.$t('masterPlanAdjust.checkProjectTips'));
                    } else {
                        this.handleSelect(params, 'projectName', () => {
                            this._getProjectMasterInfo(params);
                        });
                    }
                });
            } else {
                this.handleSelect(params, 'projectName');
                this.$set(this.pageConfig.subTableConfig.demandMasterPlanAdjustDetail, 'tableData', []);
            }
        },
        _getProjectMasterInfo(params) {
            const data = {
                projectId: params.selectList[0].id
            };
            this.$store.dispatch('masterPlanAdjust/getProjectMasterInfo', data).then(res => {
                if (res.status === 0) {
                    if (!res.results) {
                        // 该项目未登记需求总计划，不能进行预算清单调整
                        this.$message.error(this.$t('masterPlanAdjust.checkMasterPlanTips'));
                        params.selectList = [];
                        this.handleSelect(params, 'projectName');
                        return;
                    }
                    const results = this.$clone(res.results);
                    results.masterPlanId = results.id;
                    delete results.id;
                    for (const item in results) {
                        this.$set(this.pageConfig.projectForm, item, results[item]);
                    }
                    const detailList = [];
                    results.masterPlanDetails.forEach(item => {
                        detailList.push({
                            budgetAmount: item.changeAfterAmount,
                            budgetQuantity: item.changeAfterQuantity,
                            budgetUnitPrice: item.changeAfterUnitPrice,
                            changeAfterQuantity: item.changeAfterQuantity,
                            changeAfterAmount: item.changeAfterAmount,
                            changeAfterUnitPrice: item.changeAfterUnitPrice,
                            changeAmount: 0,
                            changeQuantity: 0,
                            createTime: item.createTime,
                            eId: item.id,
                            masterPlanAdjustId: results.id,
                            remarks: item.remarks,
                            varietiesId: item.varietiesId,
                            varietiesCode: item.varietiesCode,
                            varietiesName: item.varietiesName,
                            standards: item.standards,
                            unit: item.unit
                        });
                    });
                    this.$set(this.pageConfig.subTableConfig.demandMasterPlanAdjustDetail, 'tableData', detailList);
                    const totalAmount = detailList.reduce((a, b, c) => {
                        return a += b.changeAfterAmount;
                    }, 0);
                    this.$set(this.pageConfig.projectForm, 'budgetTotalAmount', Number(totalAmount.toFixed(2)));
                } else {
                    this.$message.error(this.$t(`exception.${res.errorCode}`));
                }
            });
        },
        // 选择明细
        sysHandleSelectDetail(tableName) {
            if (!this.pageConfig.projectForm.projectName) {
                this.$message.error(this.$t('tips.pleaseSelectProject'));
                return;
            }
            const tableData = this.pageConfig.subTableConfig[tableName].tableData;
            const varietiesIdList = [];
            const detailList = [];
            for (const item of tableData) {
                varietiesIdList.push({varietiesId: item.varietiesId});
                if (item.eId) {
                    detailList.push(item);
                }
            }
            this.doNotCheckList = this.$clone(detailList);
            this.varietiesIdList = varietiesIdList;
            this.selectList = tableData;
            this.dialogVisible = true;
        },
        // 获取选中的数据
        getData(arr) {
            this.loading = true;
            const data = [];
            for (const item of arr) {
                data.push(
                    {
                        budgetQuantity: 0,
                        budgetUnitPrice: 0,
                        budgetAmount: 0,
                        changeQuantity: 0,
                        changeAfterQuantity: 0,
                        changeAfterAmount: 0,
                        changeAfterUnitPrice: 0,
                        changeAmount: 0,
                        remarks: '',
                        varietiesId: item.varietiesId,
                        varietiesName: item.varietiesName,
                        varietiesCode: item.varietiesCode,
                        standards: item.standards,
                        unit: item.unit,
                        masterPlanAdjustId: this.pageConfig.projectForm.masterPlanAdjustId
                    }
                );
            }
            this.setSubTable('demandMasterPlanAdjustDetail', data);
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
                        if (item.varietiesId === val.varietiesId) {
                            selectTableList.push(item);
                        }
                    }
                }
                for (const item of arr) {
                    const index = tableData.findIndex(v => v.varietiesId === item.varietiesId);
                    if (index < 0) {
                        selectTableList.push(item);
                    }
                }
                this.$set(this.pageConfig.subTableConfig[tableName], 'tableData', selectTableList);
            }
            this.loading = false;
            this.dialogVisible = false;
        },
        // 计算
        handleCalculation({item, row, event, subTable, rowIndex}) {
            if (item.prop === 'changeAfterUnitPrice') {
                //  变更后合价
                row.changeAfterAmount = (row.changeAfterQuantity || 0) * (row.changeAfterUnitPrice || 0);
                const data = this.$clone(this.pageConfig.subTableConfig[subTable.subTableName].tableData);
                const totalAmount = data.reduce((a, b, c) => {
                    return a += b.changeAfterAmount;
                }, 0);
                this.$set(this.pageConfig.projectForm, 'budgetTotalAmount', Number(totalAmount.toFixed(2)));
            } else if (item.prop === 'changeAfterAmount') {
                const data = this.$clone(this.pageConfig.subTableConfig[subTable.subTableName].tableData);
                const totalAmount = data.reduce((a, b, c) => {
                    return a += b.changeAfterAmount;
                }, 0);
                this.$set(this.pageConfig.projectForm, 'budgetTotalAmount', Number(totalAmount.toFixed(2)));
            } else {
                row.changeAfterQuantity = (row.budgetQuantity || 0) + (row.changeQuantity || 0);
                row.budgetAmount = (row.budgetQuantity || 0) * (row.budgetUnitPrice || 0);
                row.changeAmount = (row.changeQuantity || 0) * (row.budgetUnitPrice || 0);
                row.changeAfterAmount = (row.changeAfterQuantity || 0) * (row.changeAfterUnitPrice || 0);
                const data = this.$clone(this.pageConfig.subTableConfig[subTable.subTableName].tableData);
                const budgetTotalAmount = data.reduce((a, b, c) => {
                    return a += b.changeAfterAmount;
                }, 0);
                this.$set(this.pageConfig.projectForm, 'budgetTotalAmount', Number(budgetTotalAmount.toFixed(2)));
            }
        },
        // 输入单价后计算
        handleCalculationUnitPrice(item, row, subTable) {
            row.changeAfterQuantity = (row.budgetQuantity || 0) + (row.changeQuantity || 0);
            row.budgetAmount = (row.budgetQuantity || 0) * (row.budgetUnitPrice || 0);
            row.changeAmount = (row.changeQuantity || 0) * (row.budgetUnitPrice || 0);
            row.changeAfterUnitPrice = (row.budgetUnitPrice || 0);
            row.changeAfterAmount = (row.changeAfterQuantity || 0) * (row.changeAfterUnitPrice || 0);
            const data = this.$clone(this.pageConfig.subTableConfig[subTable.subTableName].tableData);
            const budgetTotalAmount = data.reduce((a, b, c) => {
                return a += b.changeAfterAmount;
            }, 0);
            this.$set(this.pageConfig.projectForm, 'budgetTotalAmount', Number(budgetTotalAmount.toFixed(2)));
        },
        // 删除调整明细
        handleAdjustDetailDelete(row) {
            const deletMessage = this.$t('tips.deleteDetailedTips').replace('{keyValue}', row.varietiesName);
            this.$confirm(deletMessage, `${this.$t('button.delete')}${row.varietiesName}`,
                {
                dangerouslyUseHTMLString: true,
                confirmButtonText: this.$t('button.determine'),
                cancelButtonText: this.$t('button.close'),
                type: 'warning'
                }).then(() => {
                this.pageConfig.subTableConfig.demandMasterPlanAdjustDetail.tableData.splice(this.pageConfig.subTableConfig.demandMasterPlanAdjustDetail.tableData.indexOf(row), 1);
                // 批量删除后计算
                const data = this.$clone(this.pageConfig.subTableConfig.demandMasterPlanAdjustDetail.tableData);
                const budgetTotalAmount = data.reduce((a, b, c) => {
                    return a += b.changeAfterAmount;
                }, 0);
                this.$set(this.pageConfig.projectForm, 'budgetTotalAmount', Number(budgetTotalAmount.toFixed(2)));
            });
        },
        // 保存
        handleSave (isProcess = false) {
            this.$refs.editForm.getValidateForm(() => {
                const data = this.$clone(this.pageConfig.projectForm);
                const demandMasterPlanAdjustDetail = this.$refs.demandMasterPlanAdjustDetail[0].validateTableData();
                if (!demandMasterPlanAdjustDetail || demandMasterPlanAdjustDetail.length === 0) {
                    // 存在未填写或个数错误的数据
                    this.$message.error(`${this.$t('masterPlanAdjust.demandMasterPlanAdjustDetail')}${this.$t('tips.notFilledIn')}`);
                    return;
                }
                let index = 0;
                for (const item of demandMasterPlanAdjustDetail) {
                    index = index + 1;
                    item.createTime = this.$utils.commonUtil.formatTime(new Date());
                    if (!item.budgetQuantity) {
                        if (!item.changeQuantity) {
                            // 请输入变更数量
                            this.$message.error(`${this.$t('tips.theFirst')}${index}${this.$t('tips.row')}：${this.$t('masterPlanAdjust.changeQuantityTips')}`);
                            return;
                        }
                    }
                }
                data.masterPlanAdjustDetails = demandMasterPlanAdjustDetail;
                this.handleSaveData(data, isProcess);
            });
        }
    }
};
</script>
