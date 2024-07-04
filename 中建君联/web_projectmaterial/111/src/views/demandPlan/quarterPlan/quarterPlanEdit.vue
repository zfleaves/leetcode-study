<!--
 * @Author: your name
 * @Date: 2020-07-24 15:17:01
 * @LastEditTime: 2022-01-10 14:39:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\demandPlan\quarterPlan\quarterPlanEdit.vue
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
                    <el-form-item slot="form-applyQuarter" slot-scope="{scope, item}"
                        :label="$t(item.label)" :prop="item.prop"
                        :class="item.label.length > 7 && 'maxLabel'" :title="$t(item.label)">
                        <el-cascader :props="propsQuarter"
                            v-model="scope[item.prop]" :options="options"
                            style="width: 100%"
                            @focus="handleFocus(item)"
                            @change="handleChange(item, $event)"
                            :disabled="item.inputStatus === 'disable'"
                            :clearable="item.clearable === undefined ? true : item.clearable"
                            :size="item.size || 'small'">
                        </el-cascader>
                    </el-form-item>
                </g-edit-form>
                <!-- 明细清单 -->
                <div v-if="pageConfigLoading">
                    <div v-for="subTable in pageConfig.subTableConfig" :key="subTable.subTableName">
                        <g-edit-title :title="$t(`quarterPlan.${subTable.subTableName}`)" :titleTips="$t(`quarterPlan.${subTable.titleTips}`)">
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
                            :getRowClassName="getRowClassName"
                            @editTableEvent='editTableEvent'>
                        </g-edit-pl-table>
                    </div>
                </div>
            </div>
        </edit-page>
        <!-- 选择材料分类 -->
        <g-dialog v-if="dialogVisible" :dialogConfig="dialogConfig" :isVisible.sync="dialogVisible">
            <yearMasterPlanDetails slot="body" slot-scope="{height}" :dialogHeight="height"
                :close.sync="dialogVisible"
                :selectList="selectList"
                :projectId="pageConfig.projectForm.projectId"
                planType="quarter"
                varietiesTitle="quarterPlan.masterPlan"
                @getData="getData" v-if="dialogVisible">
            </yearMasterPlanDetails>
        </g-dialog>
    </div>
</template>
<script>
import Page from './configEdit.js';
import {editPage} from 'mixins/editMixins';

export default {
    name: 'quarterPlanEdit',
    mixins: [editPage],
    data () {
        const currentApplyQuantityValid = (rule, value, callback) => {
            if (!value) {
                callback(new Error(this.$t('quarterPlan.currentApplyQuantityTips')));
            } else {
                callback();
            }
        };
        const myDate = new Date();
        const year = myDate.getFullYear(); // 获取当前年份(2位)
        const month = myDate.getMonth() + 1;
        const currQuarter = Math.floor((month % 3 === 0 ? (month / 3) : (month / 3 + 1)));
        return {
            page: new Page(),
            applyQuarter: [],
            projectForm: {
                applyQuarter: [`${year}`, `Q${currQuarter}`],
                attachment: '',
                partyAUnitId: 0,
                partyAUnitName: '',
                projectId: 0,
                remarks: '',
                orgId: this.$utils.Auth.hasUserInfo().orgId,
                parentSubOrgId: this.$utils.Auth.hasUserInfo().parentSubOrgId,
                createTime: this.$utils.commonUtil.formatTime(new Date()),
                createByName: this.$utils.Auth.hasUserInfo().userName
            },
            dialogVisible: false,
            dialogConfig: {
                title: this.$t('quarterPlan.seleMaterialVarieties'),
                appendBody: false,
                center: true,
                top: '50px',
                width: '80%',
                span: '0.75'
            },
            selectList: [],
            back: '',
            propsQuarter: {
                value: 'value',
                label: 'label',
                lazy: false
            },
            oldRelationForm: {},
            subTableCustomRules: {
                currentApplyQuantity: [{required: true, validator: currentApplyQuantityValid, trigger: 'blur' }]
            }
        };
    },
    props: {
        processParmas: {
            type: Object,
            default: () => {}
        }
    },
    created () {
        this.oldRelationForm = this.$clone(this.pageConfig.projectForm);
    },
    computed: {
        options() {
            const year = 1997;
            const options = [];
            const nodes = [];
            const applyQuarterList = this.$clone(this.page.PageConfig.applyQuarterList);
            for (const item of applyQuarterList) {
                nodes.push({
                    label: item.dataName,
                    value: item.dataCode,
                    leaf: true
                });
            }
            for (let i = 0 ; i <= 100; i++) {
                options.push({
                    label: `${year + i}`,
                    value: `${year + i}`,
                    leaf: false,
                    children: nodes
                });
            }
            return options;
        }
    },
    components: {
        yearMasterPlanDetails(resolve) {
            require(['../components/yearMasterPlanDetails/yearMasterPlanDetails.vue'], resolve);
        }
    },
    methods: {
        // 选中之前
        handleFocus(item) {
            this.$set(this.oldRelationForm, item.prop, this.pageConfig.projectForm[item.prop]);
        },
        checkRow(row) {
            if (Number(((row.alreadyApplyQuantity || 0) + (row.currentApplyQuantity || 0)).toFixed(4)) > (row.budgetQuantity || 0)) {
                return true;
            } else {
                return false;
            }
        },
        // 选中
        handleChange (item, event) {
            console.log(event);
            const params = {
                paramsConfig: item,
                selectList: event,
                oldRelationForm: this.$clone(this.oldRelationForm)
            };
            this.editFormEvent({eventName: 'relationTable', params});
        },
        // 获取info数据
        async _getInfoData(id = 0) {
            await this.handleGetInfoData(id, this.page.PageConfig.processParmas.infoUrl, () => {
                const projectForm = this.$clone(this.pageConfig.projectForm);
                this.$set(this.pageConfig.projectForm, 'applyQuarter', [projectForm.applyQuarter.substring(0, 4), projectForm.applyQuarter.substring(4, 6)]);
                this.oldRelationForm = this.$clone(this.pageConfig.projectForm);
            });
        },
        // 校验项目
        handleCheckProject(params) {
            this.handleSelect(params, 'projectName', () => {
                if (params.selectList.length) {
                    this._getProjectInfo();
                } else {
                    this.$set(this.pageConfig.projectForm, 'partyAUnitId', '');
                    this.$set(this.pageConfig.projectForm, 'partyAUnitName', '');
                }
            });
        },
        // 获取项目详细信息
        _getProjectInfo() {
            const data = {
                projectId: this.pageConfig.projectForm.projectId
            };
            this.$store.dispatch('quarterPlan/getProjectInfo', data).then(res => {
                if (res.results && res.results.length) {
                    this.back = '';
                    // this.$set(this.pageConfig.projectForm, 'partyAUnitId', res.results.partyAUnitId);
                    // this.$set(this.pageConfig.projectForm, 'partyAUnitName', res.results.partyAUnitName);
                } else {
                    // 未添加需求总计划
                    this.$message.error(this.$t('quarterPlan.backTips'));
                    this.back = this.$t('quarterPlan.backTips');
                    this.$set(this.pageConfig.projectForm, 'partyAUnitId', '');
                    this.$set(this.pageConfig.projectForm, 'partyAUnitName', '');
                }
            });
        },
        // 选择明细
        sysHandleSelectDetail(tableName) {
            if (!this.pageConfig.projectForm.projectName) {
                this.$message.error(this.$t('tips.pleaseSelectProject'));
                return;
            }
            if (!this.pageConfig.projectForm.applyQuarter.length) {
                // 请选择季度
                this.$message.error(this.$t('quarterPlan.pleaseSelectApplyQuarter'));
                return;
            }
            if (this.back) {
                this.$message.error(this.$t('quarterPlan.backTips'));
                return;
            }
            this.chackProject(tableName);
        },
        // 校验项目是否已做周期
        chackProject(tableName) {
            const applyQuarter = this.pageConfig.projectForm.applyQuarter;
            const data = {
                quarterPlanId: this.id || null,
                projectId: this.pageConfig.projectForm.projectId,
                applyQuarter: applyQuarter[0] + applyQuarter[1]
            };
            this.$store.dispatch('quarterPlan/checkQuarterplan', data).then(res => {
                if (res.results) {
                    // 该项目已添加此季度需求计划，不能再次添加。
                    this.$message.error(this.$t('quarterPlan.checkQuarterPlanTips'));
                } else {
                    const tableData = this.pageConfig.subTableConfig[tableName].tableData;
                    this.selectList = tableData;
                    this.dialogVisible = true;
                }
            });
        },
        // 获取选中的数据
        getData(arr) {
            const data = [];
            for (const item of arr) {
                data.push(
                    {
                        alreadyApplyQuantity: item.alreadyApplyQuantity,
                        currentApplyQuantity: 0,
                        remarks: '',
                        eId: item.eId,
                        varietiesId: item.varietiesId,
                        varietiesName: item.varietiesName,
                        varietiesCode: item.varietiesCode,
                        standards: item.standards,
                        unit: item.unit,
                        // 带入字段
                        brand: item.brand,
                        models: item.models,
                        majorCode: item.majorCode || '',
                        majorValue: item.majorValue || '',
                        materialClassifyCode: item.materialClassifyCode || '',
                        materialClassifyValue: item.materialClassifyValue || '',
                        supplySourceCode: item.supplySourceCode || '',
                        supplySourceValue: item.supplySourceValue || '',
                        // 中标
                        bidQuantity: item.bidQuantity || '',
                        bidTotalAmount: item.bidTotalAmount || '',
                        bidUnitPrice: item.bidUnitPrice || '',
                        // 成控
                        controlQuantity: item.controlQuantity || '',
                        controlTotalAmount: item.controlTotalAmount || '',
                        controlUnitPrice: item.controlUnitPrice || '',
                        // 策划
                        budgetQuantity: item.budgetQuantity,
                        budgetTotalAmount: item.budgetTotalAmount,
                        budgetUnitPrice: item.budgetUnitPrice,
                        // 需求计划主表
                        masterPlanId: item.masterPlanId,
                        masterPlanDocNo: item.masterPlanDocNo
                    }
                );
            }
            this.setSubTable('demandQuarterPlanDetail', data);
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
                        if (item.eId === val.eId) {
                            selectTableList.push(item);
                        }
                    }
                }
                for (const item of arr) {
                    const index = tableData.findIndex(v => v.eId === item.eId);
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
                data.applyQuarter = data.applyQuarter[0] + data.applyQuarter[1];
                const demandQuarterPlanDetail = this.$refs.demandQuarterPlanDetail[0].validateTableData();
                if (!demandQuarterPlanDetail || demandQuarterPlanDetail.length === 0) {
                    // 存在未填写或个数错误的数据
                    this.$message.error(`${this.$t('quarterPlan.demandQuarterPlanDetail')}${this.$t('tips.notFilledIn')}`);
                    return;
                }
                for (const item of demandQuarterPlanDetail) {
                    item.createTime = this.$utils.commonUtil.formatTime(new Date());
                }
                data.quarterPlanDetails = demandQuarterPlanDetail;
                this.handleSaveData(data, isProcess);
            });
        }
    }
};
</script>
