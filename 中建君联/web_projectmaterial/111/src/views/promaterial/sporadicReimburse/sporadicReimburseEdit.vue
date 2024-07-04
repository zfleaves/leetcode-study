<!--
 * @Author: your name
 * @Date: 2020-07-30 10:38:43
 * @LastEditTime: 2023-05-05 13:51:10
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\sporadicReimburse\sporadicReimburseEdit.vue
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
                    <!-- 选择零星采购 -->
                    <template slot="form-reimbursePurchases" slot-scope="{scope, item}">
                        <el-form-item :label="$t(item.label)" :prop="item.prop" :class="item.label.length > 7 && 'maxLabel'"
                        :title="$t(item.label)">
                        <multiple-choice :selectConfig="selectTemporaryLeaseConfig"
                            :isDisabled="item.inputStatus !== 'disable' && pageDisabled" @select="handleSelectTemporaryLease(scope)"
                            @tagDelete="handleDeleteTemporaryLease"></multiple-choice>
                        </el-form-item>
                    </template>
                    <!-- 收款人开户银行 -->
                    <template slot="tips-payeeOpenBank">
                        <el-tooltip placement="top">
                        <div slot="content" style="line-height: 24px;">
                            <div>
                              {{$t('tips.payeeCardNoTips1')}}<br>
                              {{$t('tips.payeeCardNoTips2')}}
                            </div>
                        </div>
                        <span class="tips-item"><i class="el-icon-question"></i></span>
                        </el-tooltip>
                    </template>
                    <!--收款人  -->
                    <template slot="form-collectionUserName" slot-scope="{scope, item}" v-if="pageConfig.projectForm  && pageConfig.projectForm.deductionReserveFund === 0">
                        <el-form-item :label="$t(item.label)" :prop="item.prop" :class="item.label.length > 7 && 'maxLabel'"
                        :title="$t(item.label)">
                        <div class="slot-input">
                            <el-input v-model="scope[item.prop]"
                                :placeholder="item.placeholder ? $t(item.placeholder) : ''" :size="item.size || 'small'"
                                :clearable="item.clearable === undefined ? true : item.clearable"
                                :disabled="item.inputStatus === 'disable'" :maxlength="Number(item.maxlength)"
                                :show-word-limit="item.showWordLimit !== null ? item.showWordLimit : true">
                            </el-input>
                        </div>
                        </el-form-item>
                    </template>
                    <!--收款人卡号  -->
                    <template slot="form-payeeCardNo" slot-scope="{scope, item}" v-if="pageConfig.projectForm  && pageConfig.projectForm.deductionReserveFund === 0">
                        <el-form-item :label="$t(item.label)" :prop="item.prop" :class="item.label.length > 7 && 'maxLabel'"
                        :title="$t(item.label)">
                            <div class="slot-input">
                                <el-input v-model="scope[item.prop]"
                                    :placeholder="item.placeholder ? $t(item.placeholder) : ''" :size="item.size || 'small'"
                                    :clearable="item.clearable === undefined ? true : item.clearable"
                                    :disabled="item.inputStatus === 'disable'" :maxlength="Number(item.maxlength)"
                                    :show-word-limit="item.showWordLimit !== null ? item.showWordLimit : true">
                                </el-input>
                            </div>
                        </el-form-item>
                    </template>
                    <!--收款人开户行  -->
                    <template slot="form-payeeOpenBank" slot-scope="{scope, item}" v-if="pageConfig.projectForm  && pageConfig.projectForm.deductionReserveFund === 0">
                        <el-form-item :label="$t(item.label)" :prop="item.prop" :class="item.label.length > 7 && 'maxLabel'"
                        :title="$t(item.label)">
                            <div class="slot-input">
                                <el-input v-model="scope[item.prop]"
                                    :placeholder="item.placeholder ? $t(item.placeholder) : ''" :size="item.size || 'small'"
                                    :clearable="item.clearable === undefined ? true : item.clearable"
                                    :disabled="item.inputStatus === 'disable'" :maxlength="Number(item.maxlength)"
                                    :show-word-limit="item.showWordLimit !== null ? item.showWordLimit : true">
                                </el-input>
                            </div>
                        </el-form-item>
                    </template>
                    <!--收款人开户行  -->
                    <template slot="form-deductionReserveFund" slot-scope="{scope, item}">
                        <el-form-item :label="$t(item.label)" :prop="item.prop" :class="item.label.length > 7 && 'maxLabel'"
                        :title="$t(item.label)">
                            <div class="slot-input">
                                <el-select v-model="scope[item.prop]"
                                    :placeholder="item.placeholder ? $t(item.placeholder) : ''" :size="item.size || 'small'"
                                    :disabled="item.inputStatus === 'disable'" :filterable="item.filterable || true"
                                    :multiple='item.multiple || false' :collapse-tags='item.collapseTags || false'
                                    :clearable="item.clearable === undefined ? true : item.clearable" style="width:100%"
                                    @change="handleDeductionReserveFundChange(item)">
                                    <el-option v-for="(child,i) in item.selectList" :key="i"
                                        :label="item.isTranslate ? $t(child.dataName) : child.dataName"
                                        :value="item.isNumber ? Number(child.dataCode) : child.dataCode" :disabled="child.disabled || false">
                                    </el-option>
                                </el-select>
                                <el-tooltip placement="top">
                                    <div slot="content" style="line-height: 24px;">
                                        <div>
                                        {{$t('sporadicReimburse.deductionReserveFundTips1')}}<br>
                                        <!-- {{$t('tips.payeeCardNoTips2')}} -->
                                        <!-- {{如果此次报销内容已提前领取过备用金，请选择是，且流程中出纳不需要填写实际支付情况；其他情况请选择否，按正常流程进行。}} -->
                                        </div>
                                    </div>
                                    <span class="tips-item"><i class="el-icon-question"></i></span>
                                </el-tooltip>
                            </div>
                        </el-form-item>
                    </template>
                </g-edit-form>
                <!-- 明细清单 -->
                <div v-if="pageConfigLoading">
                    <div v-for="subTable in pageConfig.subTableConfig" :key="subTable.subTableName">
                        <g-edit-title :title="$t(`sporadicReimburse.${subTable.subTableName}`)" :titleTips="$t(`sporadicReimburse.${subTable.titleTips}`)"
                        v-if="subTable.subTableName === 'purchaseSporadicReimburseDetail' ||
                        subTable.subTableName === 'purchaseSporadicReimbursePayments' && pageConfig.projectForm && pageConfig.projectForm.deductionReserveFund === 0">
                            <g-button :operationButtons="subTable.subTableButton" @editTableBut="mainOperateBtnSubTable"
                                :paymentAccountDescription="subTable.subTableName === 'purchaseSporadicReimbursePayments' ? true : false">
                                <div v-if="subTable.subTableName === 'purchaseSporadicReimburseDetail'" class="calculationTule" slot="first">
                                    <el-select v-model="calculation" @change="handleSelectCalculation">
                                        <!-- 填写含税计算不含税 -->
                                        <el-option  :label="$t('tips.calculation1')" value="01">
                                        </el-option>
                                        <!-- 填写不含税计算含税 -->
                                        <el-option  :label="$t('tips.calculation2')" value="02">
                                        </el-option>
                                    </el-select>
                                </div>
                            </g-button>
                        </g-edit-title>
                        <g-edit-pl-table
                            v-if="subTable.subTableName === 'purchaseSporadicReimburseDetail' ||
                            subTable.subTableName === 'purchaseSporadicReimbursePayments' && pageConfig.projectForm && pageConfig.projectForm.deductionReserveFund === 0"
                            :ref="subTable.subTableName"
                            :type="type"
                            :isSelection="subTable.isSelection"
                            :tableConfig="subTable.tableList"
                            :subTable='subTable'
                            :delete.sync="deleteList[subTable.subTableName]"
                            :getRowClassName="getRowClassName"
                            :customRules="subTableCustomRules"
                            @editTableEvent='editTableEvent'>
                        </g-edit-pl-table>
                    </div>
                </div>
            </div>
        </edit-page>
        <!-- 选择材料分类 -->
        <g-dialog v-if="dialogTemporaryLease" :dialogConfig="dialogConfig" :isVisible.sync="dialogTemporaryLease">
            <sporadicPurchase slot="body" slot-scope="{height}" :dialogHeight="height"
                :close.sync="dialogTemporaryLease"
                :selectId="selectTemporaryLeaseConfig.tagDada"
                :projectId="pageConfig.projectForm.projectId"
                @getData="getTemporaryLeaseData" v-if="dialogTemporaryLease">
            </sporadicPurchase>
        </g-dialog>
        <!-- 选择零星材料明细 -->
        <g-dialog v-if="dialogPurchaseApplyVisible" :dialogConfig="dialogPurchaseApplyConfig" :isVisible.sync="dialogPurchaseApplyVisible">
            <purchaseApplyDetail slot="body" slot-scope="{height}" :dialogHeight="height"
                :close.sync="dialogPurchaseApplyVisible"
                :selectList="selectList"
                :projectId="pageConfig.projectForm.projectId"
                :sporadicPurchaseIds="selectTemporaryLeaseConfig.tagDada"
                varietiesTitle="sporadicReimburse.seleSporadicPurchase"
                @getData="getPurchaseApplyData" v-if="dialogPurchaseApplyVisible">
            </purchaseApplyDetail>
        </g-dialog>
    </div>
</template>
<script>
import Page from './configEdit.js';
import {editPage} from 'mixins/editMixins';

export default {
    name: 'sporadicReimburseEdit',
    mixins: [editPage],
    data () {
        const quantityValid = (rule, value, callback) => {
            if (!value) {
                callback(new Error(`${this.$t('tips.pleaseEnter')}${this.$t('sporadicReimburse.quantity')}`));
            } else {
                callback();
            }
        };
        return {
            page: new Page(),
            projectForm: {
                reimbursePurchases: [],
                purchaseApplyCode: '',
                actualPaymentAmount: '',
                attachment: '',
                collectionUserId: '',
                collectionUserName: '',
                currencyCode: '',
                currencyValue: '',
                paymentDate: '',
                projectId: 0,
                purchaseApplyId: '',
                purchaseApplyName: '',
                reimburseAmount: 0,
                reimburseContent: '',
                reimburseDate: this.$utils.commonUtil.formatTime(new Date()),
                reimburseUserId: this.$utils.Auth.hasUserInfo().userId,
                reimburseUserName: this.$utils.Auth.hasUserInfo().userName,
                remarks: '',
                costControlRuleCode: '',
                costControlRuleValue: '',
                invoiceCode: '',
                invoiceNo: '',
                deductionReserveFund: 0,
                ifAcquireInvoice: 1,
                payeeCardNo: '',
                payeeOpenBank: '',
                orgId: this.$utils.Auth.hasUserInfo().orgId,
                parentSubOrgId: this.$utils.Auth.hasUserInfo().parentSubOrgId,
                createTime: this.$utils.commonUtil.formatTime(new Date()),
                createByName: this.$utils.Auth.hasUserInfo().userName
            },
            // 选择零星采购
            dialogTemporaryLease: false,
            dialogConfig: {
                title: this.$t('sporadicReimburse.seleSporadicPurchase'),
                appendBody: false,
                center: true,
                top: '50px',
                width: '80%',
                span: '0.75'
            },
            // 选择零星采购明细
            dialogPurchaseApplyVisible: false,
            dialogPurchaseApplyConfig: {
                title: this.$t('tips.pleaseSelectDetailed'),
                appendBody: false,
                center: true,
                top: '50px',
                width: '80%',
                span: '0.75'
            },
            selectTemporaryLeaseConfig: {
                // 显示的列表
                tagDada: [],
                // id
                rowKey: 'purchaseApplyId',
                // name
                rowName: 'purchaseApplyCode',
                // 默认显示的个数
                constNum: 5,
                rowLabel: 'sporadicReimburse.purchaseApplyName',
                isCanInfo: true,
                routerId: 'purchaseApplyId',
                routerName: 'sporadicPurchase'
            },
            isTemporaryLease: false,
            selectList: [],
            purchaseApplyConfig: {},
            subTableCustomRules: {
                quantity: [{required: true, validator: quantityValid, trigger: 'blur' }]
            },
            calculation: '01'
        };
    },
    props: {
        processParmas: {
            type: Object,
            default: () => {}
        }
    },
    components: {
        sporadicPurchase(resolve) {
            require(['../compoent/sporadicPurchase/sporadicPurchase'], resolve);
        },
        purchaseApplyDetail(resolve) {
            require(['../compoent/purchaseApplyDetail/purchaseApplyDetail'], resolve);
        }
    },
    async created() {
        if (this.type === 'add') {
            await this.$store.dispatch('sporadicReimburse/getPersonnelAccount', {personnelUserId: this.pageConfig.projectForm.reimburseUserId}).then(r => {
                const arr = r.results;
                if (arr.length) {
                    arr[0].cardNumber && this.$set(this.pageConfig.projectForm, 'payeeCardNo', arr[0].cardNumber);
                    arr[0].openAccountBank && this.$set(this.pageConfig.projectForm, 'payeeOpenBank', arr[0].openAccountBank);
                }
            });
        }
    },
    methods: {
        // 获取info数据
        async _getInfoData(id = 0) {
            await this.handleGetInfoData(id, this.page.PageConfig.processParmas.infoUrl, () => {
                this.selectTemporaryLeaseConfig.tagDada = this.pageConfig.projectForm.reimbursePurchases;
                this.selectTemporaryLeaseConfig.tagDada.length > 0 ? this.isTemporaryLease = true : this.isTemporaryLease = false;
                this.displayFieldsAccordingToProjectControlType('purchaseSporadicReimburseDetail');
            });
        },
        checkRow(row) {
            if (Number(((row.quantity || 0) + (row.alreadyReimburseQuantity || 0)).toFixed(4)) > (row.sporadicPurchaseQuantity || 0)) {
                return true;
            } else {
                return false;
            }
        },
        // 校验项目
        handleCheckProject (params) {
        this.handleSelect(params, 'projectName', () => {
            if (params.selectList.length) {
                 this.displayFieldsAccordingToProjectControlType('purchaseSporadicReimburseDetail');
            } else {
                this.$set(this.selectTemporaryLeaseConfig, 'tagDada', []);
                this.$set(this.selectTemporaryLeaseConfig, 'purchaseApplyName', '');
                this.$set(this.selectTemporaryLeaseConfig, 'purchaseApplyId', '');
                this.$set(this.selectTemporaryLeaseConfig, 'purchaseApplyCode', '');
                this.$set(this.selectTemporaryLeaseConfig, 'collectionUserName', '');
                this.$set(this.selectTemporaryLeaseConfig, 'collectionUserId', '');
                this.$set(this.selectTemporaryLeaseConfig, 'reimbursePurchases', []);
            }
        });
        },
        // 选择明细
        sysHandleSelectDetail(tableName) {
            if (!this.pageConfig.projectForm.projectName) {
                this.$message.error(this.$t('tips.pleaseSelectProject'));
                return;
            }
            if (!this.selectTemporaryLeaseConfig.tagDada.length) {
                this.$message.error(`${this.$t('tips.pleaseSelect')}${this.$t('sporadicReimburse.purchaseApplyName')}`);
                return;
            }
            const tableData = this.$clone(this.pageConfig.subTableConfig['purchaseSporadicReimburseDetail'].tableData);
            const choiceTableData = tableData.filter(v => v.eId);
            this.selectList = choiceTableData;
            this.dialogPurchaseApplyVisible = true;
        },
        // 获取选中的数据
        getPurchaseApplyData(arr) {
            const data = [];
            for (const item of arr) {
                const quantity = item.currentApplyQuantity - item.alreadySporadicQuantity;
                const estimateUnitPrice = Number(item.includeUnitPrice) || Number(item.estimateUnitPrice) || 0; // 单价（含税）
                const taxRate = Number(item.incomingTaxRate) || Number(item.taxRate) || 0; // 税率
                const estimateAmount = quantity * estimateUnitPrice; // 金额(含税)
                const excludeTaxAmount = estimateAmount / (1 + taxRate); // 金额(不含税)
                const taxAmount = estimateAmount / (1 + taxRate) * taxRate; // 税额
                const excludeUnitPrice = !quantity ? 0 : estimateAmount / (1 + taxRate) / quantity; // 单价不含税
                data.push(
                    {
                        amount: excludeTaxAmount,
                        createTime: this.$utils.commonUtil.formatTime(new Date()),
                        eId: item.eId,
                        models: item.models,
                        sporadicPurchaseQuantity: item.currentApplyQuantity, // 零星采购数量
                        alreadyReimburseQuantity: item.alreadySporadicQuantity, // 已报销数量
                        quantity,
                        remarks: '',
                        varietiesName: item.varietiesName,
                        materialName: item.executeVarietiesName,
                        standards: item.executeStandards,
                        taxRate,
                        unit: item.executeUnit,
                        unitPrice: excludeUnitPrice,
                        includeUnitPrice: estimateUnitPrice,
                        includeTaxAmount: estimateAmount,
                        taxAmount,
                        varietiesId: item.varietiesId,
                        brand: item.brand,
                        // 主表字段
                        purchaseApplyId: item.purchaseApplyId,
                        purchaseApplyCode: item.purchaseApplyCode,
                        // 带入字段
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
                        // 所属工程量名称、编号和所属费用类型名称和编号字段
                        expenseCode: item.expenseCode || '',
                        expenseName: item.expenseName || '',
                        quantitiesName: item.quantitiesName || '',
                        quantitiesCode: item.quantitiesCode || '',
                        budgetCode: item.budgetCode || ''
                    }
                );
            }
            this.setSubTable('purchaseSporadicReimburseDetail', data);
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
            this.dialogPurchaseApplyVisible = false;
        },
        handleDeductionReserveFundChange(item) {
            const tableData = this.$clone(this.pageConfig.subTableConfig['purchaseSporadicReimbursePayments'].tableData);
            if (tableData && tableData.length) {
                const deletMessage = this.$t('tips.chengeDataTips').replace('{keyValue}', this.$t('sporadicReimburse.deductionReserveFund'));
                this.$confirm(deletMessage, this.$t('tips.dataChangePrompt'), {
                    confirmButtonText: this.$t('button.determine'),
                    cancelButtonText: this.$t('button.close'),
                    dangerouslyUseHTMLString: true,
                    type: 'warning'
                }).then(() => {
                    this.$set(this.pageConfig.subTableConfig.purchaseSporadicReimbursePayments, 'tableData', []);
                    this.$set(this.oldProjectForm, item.prop, this.pageConfig.projectForm[item.prop]);
                    this.setDeductionReserveFund();
                }).catch(() => {
                    this.$set(this.pageConfig.projectForm, item.prop, this.oldProjectForm[item.prop]); // 显示值
                });
            } else {
                this.$set(this.oldProjectForm, item.prop, this.pageConfig.projectForm[item.prop]);
                this.setDeductionReserveFund();
            }
        },
        setDeductionReserveFund() {
            if (this.pageConfig.projectForm.deductionReserveFund === 1) {
                this.pageConfig.projectForm.collectionUserName = '';
                this.pageConfig.projectForm.collectionUserId = '';
                this.pageConfig.projectForm.payeeCardNo = '';
                this.pageConfig.projectForm.payeeOpenBank = '';
                this.$set(this.pageConfig.subTableConfig.purchaseSporadicReimbursePayments, 'tableData', []);
            } else if (this.pageConfig.projectForm.deductionReserveFund === 0) {
                this.pageConfig.projectForm.collectionUserName = '';
                this.pageConfig.projectForm.collectionUserId = '';
                this.pageConfig.projectForm.payeeCardNo = '';
                this.pageConfig.projectForm.payeeOpenBank = '';
            }
        },
        // 选择零星采购单
        handleSelectTemporaryLease (row) {
            if (!this.pageConfig.projectForm.projectName) {
                this.$message.error(this.$t('tips.pleaseSelectProject'));
                return;
            }
            this.isTemporaryLease = true;
            this.dialogTemporaryLease = true;
        },
        // 删除零星采购单
        handleDeleteTemporaryLease (row) {
            const tableData = this.pageConfig.subTableConfig.purchaseSporadicReimburseDetail.tableData;
            if (tableData && tableData.length) {
                this.sysChangeDeleteDetail('purchaseSporadicReimburseDetail', () => {
                const index = this.selectTemporaryLeaseConfig.tagDada.findIndex(v => v.purchaseApplyId === row.purchaseApplyId);
                if (index >= 0) {
                    this.selectTemporaryLeaseConfig.tagDada.splice(index, 1);
                }
                });
            } else {
                const index = this.selectTemporaryLeaseConfig.tagDada.findIndex(v => v.purchaseApplyId === row.purchaseApplyId);
                if (index >= 0) {
                this.selectTemporaryLeaseConfig.tagDada.splice(index, 1);
                }
            }
        },
        // 获取选择的零星采购单
        getTemporaryLeaseData (arr) {
            const data = [];
            const list = [];
            arr.forEach(item => {
                data.push(
                {
                    createBy: this.$utils.Auth.hasUserInfo().userId,
                    createTime: this.$utils.commonUtil.formatTime(new Date()),
                    purchaseApplyCode: item.purchaseApplyCode,
                    purchaseApplyName: item.purchaseApplyName,
                    purchaseApplyId: item.purchaseApplyId
                }
                );
                list.push(item.purchaseApplyId);
            });
            const tableData = this.pageConfig.subTableConfig.purchaseSporadicReimburseDetail.tableData;
            if (tableData && tableData.length) {
                const tempTagDada = this.selectTemporaryLeaseConfig.tagDada.map(v => v.purchaseApplyId);
                if (list.join(',') !== tempTagDada.join(',')) {
                this.sysChangeDeleteDetail('purchaseSporadicReimburseDetail', () => {
                    this.selectTemporaryLeaseConfig.tagDada = data;
                });
                this.dialogTemporaryLease = false;
                return;
                }
            }
            this.selectTemporaryLeaseConfig.tagDada = data;
            this.dialogTemporaryLease = false;
        },
        // 更换后删除明细
        sysChangeDeleteDetail (tableName, callback) {
            const keyValue = this.$t('sporadicReimburse.purchaseApplyName');
            const deletMessage = this.$t('tips.chengeDataTips').replace('{keyValue}', keyValue);
            this.$confirm(deletMessage, `${this.$t('button.batchDeletion')}`, {
                dangerouslyUseHTMLString: true,
                confirmButtonText: this.$t('button.determine'),
                cancelButtonText: this.$t('button.close'),
                type: 'warning'
            }).then(() => {
                this.deleteDetail(tableName, Array.from(this.pageConfig.subTableConfig[tableName].tableData));
                callback && callback();
            }).catch(e => { });
        },
        // 切换计算规则
        handleSelectCalculation(val) {
            const tableData = this.$clone(this.pageConfig.subTableConfig['purchaseSporadicReimburseDetail'].tableData);
            if (tableData.length === 0) return;
            const messageTips = this.$t('tips.selectCalculationTips');
            this.$confirm(messageTips, this.$t('tips.selectCalculation'), {
                dangerouslyUseHTMLString: true,
                confirmButtonText: this.$t('button.determine'),
                cancelButtonText: this.$t('button.close'),
                type: 'warning'
            }).then(() => {
            }).catch(e => {
                this.calculation = val === '01' ? '02' : '01';
            });
        },
        // 计算
        handleCalculation({item, row, event, subTable, rowIndex}) {
            if (subTable.subTableName === 'purchaseSporadicReimbursePayments') {
                this.deletTableCallback(subTable.subTableName);
            } else {
              if (this.calculation === '01') {
                    this.handleCalculation1({ item, row, event, subTable, rowIndex });
                } else {
                    this.handleCalculation2({ item, row, event, subTable, rowIndex });
                }
                this.deletTableCallback(subTable.subTableName);
            }
        },
        // 填写含税计算不含税
        handleCalculation1({ item, row, event, subTable, rowIndex }) {
            // 1，如果填写规则是填写含税计算不含税：则在填写数量、税率、金额（含税）后计算其他值；计算包括
            // 金额不含税=金额含税除以（1+税率）
            // 税额=金额含税/(1+税率) * 税率
            // 单价不含税=金额含税/(1+税率)/数量 如果数量为0 直接等于0
            if (item.prop === 'includeUnitPrice') {
                const quantity = Number(row.quantity) || 0; // 数量
                const includeUnitPrice = Number(row.includeUnitPrice) || 0; // 单价（含税）
                const includeTaxAmount = quantity * includeUnitPrice;
                this.$set(row, 'includeTaxAmount', Number((includeTaxAmount || 0).toFixed(2)));

                const taxRate = Number(row.taxRate) || 0; // 税率
                const amount = includeTaxAmount / (1 + taxRate); // 金额(不含税)
                const taxAmount = includeTaxAmount / (1 + taxRate) * taxRate; // 税额
                const unitPrice = !quantity ? 0 : includeTaxAmount / (1 + taxRate) / quantity; // 单价不含税
                this.$set(row, 'amount', Number((amount || 0).toFixed(2)));
                this.$set(row, 'taxAmount', Number((taxAmount || 0).toFixed(2)));
                this.$set(row, 'unitPrice', Number((unitPrice || 0).toFixed(8)));
            }
            if (item.prop === 'includeTaxAmount' && (row.includeUnitPrice === '' || row.includeUnitPrice === null)) {
                const quantity = Number(row.quantity) || 0; // 数量
                const includeTaxAmount = Number(row.includeTaxAmount) || 0; // 金额（含税）
                const includeUnitPrice = includeTaxAmount / quantity;
                this.$set(row, 'includeUnitPrice', !quantity ? 0 : Number((includeUnitPrice || 0).toFixed(4)));
            }
            if (item.prop === 'quantity' || item.prop === 'taxRate') {
                const quantity = Number(row.quantity) || 0; // 数量
                const includeUnitPrice = Number(row.includeUnitPrice) || 0; // 单价（含税）
                const taxRate = Number(row.taxRate) || 0; // 税率
                const includeTaxAmount = quantity * includeUnitPrice; // 金额(含税)
                const amount = includeTaxAmount / (1 + taxRate); // 金额(不含税)
                const taxAmount = includeTaxAmount / (1 + taxRate) * taxRate; // 税额
                const unitPrice = !quantity ? 0 : includeTaxAmount / (1 + taxRate) / quantity; // 单价不含税
                this.$set(row, 'includeTaxAmount', Number((includeTaxAmount || 0).toFixed(2)));
                this.$set(row, 'amount', Number((amount || 0).toFixed(2)));
                this.$set(row, 'taxAmount', Number((taxAmount || 0).toFixed(2)));
                this.$set(row, 'unitPrice', Number((unitPrice || 0).toFixed(8)));
            }
            if (item.prop === 'includeTaxAmount' && row.includeUnitPrice >= 0) {
                const quantity = Number(row.quantity) || 0; // 数量
                const taxRate = Number(row.taxRate) || 0; // 税率
                const includeTaxAmount = Number(row.includeTaxAmount) || 0; // 金额(含税)
                const amount = includeTaxAmount / (1 + taxRate); // 金额(不含税)
                const taxAmount = includeTaxAmount / (1 + taxRate) * taxRate; // 税额
                const unitPrice = !quantity ? 0 : includeTaxAmount / (1 + taxRate) / quantity; // 单价不含税
                this.$set(row, 'includeTaxAmount', Number((includeTaxAmount || 0).toFixed(2)));
                this.$set(row, 'amount', Number((amount || 0).toFixed(2)));
                this.$set(row, 'taxAmount', Number((taxAmount || 0).toFixed(2)));
                this.$set(row, 'unitPrice', Number((unitPrice || 0).toFixed(8)));
            }
        },
        // 填写不含税计算含税
        handleCalculation2({ item, row, event, subTable, rowIndex }) {
            // 2 如果填写规则是填写不含税计算含税：则在填写数量、税率、金额（不含税）后计算其他值；计算包括：
            // 金额含税=金额不含税乘以（1+税率）
            // 税额=金额不含税*税率
            // 单价不含税=金额不含税除以数量 如果数量为0 直接等于0
            if (item.prop === 'unitPrice') {
                const quantity = Number(row.quantity) || 0; // 数量
                const unitPrice = Number(row.unitPrice) || 0; // 单价（不含税）
                const taxRate = Number(row.taxRate) || 0; // 税率
                const amount = quantity * unitPrice;
                this.$set(row, 'amount', Number((amount || 0).toFixed(2)));

                const includeTaxAmount = amount * (1 + taxRate); // 金额(含税)
                const taxAmount = amount * taxRate; // 税额
                const includeUnitPrice = includeTaxAmount / quantity;
                this.$set(row, 'includeTaxAmount', Number((includeTaxAmount || 0).toFixed(2)));
                this.$set(row, 'includeUnitPrice', !quantity ? 0 : Number((includeUnitPrice || 0).toFixed(4)));
                this.$set(row, 'taxAmount', Number((taxAmount || 0).toFixed(2)));
            }

            if (item.prop === 'amount' && (row.unitPrice === '' || row.unitPrice === null)) {
                const quantity = Number(row.quantity) || 0; // 数量
                const amount = Number(row.amount) || 0; // 金额（含税）
                const unitPrice = amount / quantity;
                this.$set(row, 'unitPrice', !quantity ? 0 : Number((unitPrice || 0).toFixed(8)));
            }

            if (item.prop === 'quantity' || item.prop === 'taxRate' || item.prop === 'amount') {
                const quantity = Number(row.quantity) || 0; // 数量
                const taxRate = Number(row.taxRate) || 0; // 税率
                const amount = Number(row.amount) || 0; // 金额(不含税)
                const includeTaxAmount = amount * (1 + taxRate); // 金额(含税)
                const taxAmount = amount * taxRate; // 税额
                const includeUnitPrice = includeTaxAmount / quantity;
                this.$set(row, 'includeTaxAmount', Number((includeTaxAmount || 0).toFixed(2)));
                this.$set(row, 'includeUnitPrice', !quantity ? 0 : Number((includeUnitPrice || 0).toFixed(4)));
                this.$set(row, 'taxAmount', Number((taxAmount || 0).toFixed(2)));
            }
        },
        // 批量删除后计算
        deletTableCallback(tableName) {
            if (tableName === 'purchaseSporadicReimbursePayments') {
                const data = this.$clone(this.pageConfig.subTableConfig[tableName].tableData);
                const actualPaymentAmount = data.reduce((a, b, c) => {
                    return a += Number(b.paymentAmount || 0);
                }, 0);
                this.$set(this.pageConfig.projectForm, 'actualPaymentAmount', Number(actualPaymentAmount.toFixed(2)));
            } else {
                const data = this.$clone(this.pageConfig.subTableConfig[tableName].tableData);
                const reimburseAmount = data.reduce((a, b, c) => {
                    return a += Number(b.includeTaxAmount || 0);
                }, 0);
                this.$set(this.pageConfig.projectForm, 'reimburseAmount', Number(reimburseAmount.toFixed(2)));
            }
        },
        // 保存
        handleSave (isProcess = false) {
            this.pageConfig.projectForm.reimbursePurchases = this.selectTemporaryLeaseConfig.tagDada;
            this.$refs.editForm.getValidateForm(() => {
                const data = this.$clone(this.pageConfig.projectForm);
                if (data.ifAcquireInvoice && !data.attachment) {
                    // 已经取得发票，请务必正确上传发票附件。
                    this.$message.error(this.$t('tips.acquireInvoiceAttachmentTips1'));
                    return;
                }
                if (!data.actualPaymentAmount) {
                    data.actualPaymentAmount = 0;
                }
                const index = this.pageConfig.mainFormConfig.formList.findIndex(v => v.prop === 'actualPaymentAmount');
                if (index >= 0) {
                    if (this.pageConfig.mainFormConfig.formList[index] === 'edit' && !data.actualPaymentAmount) {
                        // 请输入支付金额
                        this.$message.error(this.$t('sporadicReimburse.actualPaymentAmountTips'));
                        return;
                    }
                }
                const purchaseSporadicReimburseDetail = this.$refs.purchaseSporadicReimburseDetail[0].validateTableData();
                if (!purchaseSporadicReimburseDetail || purchaseSporadicReimburseDetail.length === 0) {
                    // 存在未填写或个数错误的数据
                    this.$message.error(`${this.$t('sporadicReimburse.purchaseSporadicReimburseDetail')}${this.$t('tips.notFilledIn')}`);
                    return;
                }
                // 支付明细
                let purchaseSporadicReimbursePayments = [];
                if (this.$refs.purchaseSporadicReimbursePayments && this.$refs.purchaseSporadicReimbursePayments[0]) {
                    purchaseSporadicReimbursePayments = this.$refs.purchaseSporadicReimbursePayments[0].validateTableData();
                }
                if (!purchaseSporadicReimbursePayments) {
                    // 存在未填写或个数错误的数据
                    this.$message.error(`${this.$t('sporadicReimburse.purchaseSporadicReimbursePayments')}${this.$t('tips.notFilledIn')}`);
                    return;
                }
                this.getCapitalProjectPayment(data, () => {
                    data.reimbursePurchases = this.selectTemporaryLeaseConfig.tagDada;
                    data.sporadicReimburseDetails = purchaseSporadicReimburseDetail;
                    data.payments = purchaseSporadicReimbursePayments;
                    if (data.invoiceCode && data.invoiceNo) {
                        this.checkTenantInvoiceExist(data, isProcess).then(res => {
                            if (res.status === 0) {
                                if (!res.results) {
                                    this.beforeAmountSave(data, isProcess);
                                } else {
                                    // 您输入的发票号码+发票代码 在 业务名称 中存在，单据为：_单据号-创建人姓名-创建时间，为避免发票重复，请您核对并修正后保存。
                                    const params = {
                                        invoiceNo: data.invoiceNo,
                                        invoiceCode: data.invoiceCode
                                    };
                                    this.$store.dispatch('publicApi/tenantInvoiceInfo', params).then(res => {
                                        if (res.status === 0) {
                                            const infomation = `${res.results.businessDocNo}-${res.results.createByName}-${res.results.createTime.split(' ')[0]}`;
                                            const invoiceNumExistsErrorTips = this.$t('tips.invoiceNumExistsErrorTips').replace('{keyValue}', res.results.businessName);
                                            const message = `${invoiceNumExistsErrorTips}【${infomation}】${this.$t('tips.avoidExistsPleaseCorrect')}`;
                                            return this.$message.error(message);
                                        }
                                    });
                                }
                            }
                        });
                    } else {
                        this.beforeAmountSave(data, isProcess);
                    }
                });
            });
        },
        async getCapitalProjectPayment(data, callback) {
            await this.$store.dispatch('publicApi/getCapitalProjectPaymentPublicApi', {projectId: data.projectId, costTypeCode: '03'}).then(res => {
                if (res.status === 0) {
                    const results = res.results;
                    if (!results) {
                        callback && callback();
                        return;
                    }
                    if (results.paymentControlCode === '03') {
                        callback && callback();
                    } else {
                        // 当为01强管控，5.2中的对比超出时，弹出提示并不能保存，提示为：项目资金限制支出金额：xxx，已付款额：xxx， 本次申请后会超过限制支出金额！
                        // 当02弱管控，5.2中的对比超出时，弹出二次确认框，点击确认后可以保存；提示为：项目资金限制支出金额：xxx，已付款额：xxx， 本次申请后会超过限制支出金额！您确定要发起此付款申请吗？
                        // 总收款控支时，取页面申请付款金额+项目支付回写表中项目总支出金额与项目资金设置中的限制支出总金额对比，
                        // 收入关联人材机控支时，取页面申请付款金额+项目支付回写表中此项目当前所处子系统的总支出金额与项目资金设置中的对应的限制支出金额之和对比；
                        const reimburseAmount = Number(data.reimburseAmount) || 0; // 报销金额
                        const totalActualPaymentAmount = Number(results.totalActualPaymentAmount) || 0; // 项目支付回写表中项目总支出金额
                        const totalLimitExpendAmount = Number(results.totalLimitExpendAmount) || 0; // 项目资金限制支出金额
                        const totalLimitMaterialAmount = Number(results.totalLimitMaterialAmount) || 0; // 机械-项目资金限制支出金额
                        const limitExpendAmount = results.capitalRuleCode === '01' ? totalLimitExpendAmount : totalLimitMaterialAmount;
                        const msg1 = `${this.$t('tips.capitalProjectPaymentTips1')}: ${limitExpendAmount}`;
                        const msg2 = `${this.$t('tips.capitalProjectPaymentTips2')}: ${totalActualPaymentAmount}`;
                        const msg3 = results.paymentControlCode === '01' ? this.$t('tips.capitalProjectPaymentTips3') : this.$t('tips.capitalProjectPaymentTips4');
                        if (Number((reimburseAmount + totalActualPaymentAmount).toFixed(2)) > limitExpendAmount) {
                            if (results.paymentControlCode === '02') {
                            this.$confirm(`${msg1}, ${msg2}, ${msg3}`, this.$t('tips.tips'), {
                                confirmButtonText: this.$t('button.determine'),
                                cancelButtonText: this.$t('button.close'),
                                dangerouslyUseHTMLString: true,
                                type: 'warning'
                            }).then(() => {
                                callback && callback();
                            });
                            } else {
                            this.$message.error(`${msg1}, ${msg2}, ${msg3}`);
                            }
                        } else {
                            callback && callback();
                        }
                    }
                }
            });
        },
        // 校验发票号码和代码是否已经存在(如果存在返回true,否则返回false)
        checkTenantInvoiceExist(data, isProcess) {
            const params = {
                invoiceNo: data.invoiceNo,
                invoiceCode: data.invoiceCode
            };
            return this.$store.dispatch('publicApi/tenantInvoiceExist', params).then();
        },
        // 校验申请金额和实际付款金额
        beforeAmountSave(data, isProcess) {
            const { reimburseAmount, actualPaymentAmount } = data;
            const msg1 = [];
             // 实际支付金额与报销金额与不一致，确定要继续保存吗？
            if (actualPaymentAmount && Number(reimburseAmount.toFixed(2)) !== Number(actualPaymentAmount.toFixed(2))) {
                msg1.push(`${msg1.length + 1}、 ${this.$t('tips.saveAmountTips1')}`);
            }
            // 保存时，如果发票号码和发票代码有值，则进行查重
            // 如果任一一个字段没有值，则二次提示：您没有输入发票号码或者发票代码，系统无法自动查重，可能会存在发票重复的情形，为企业带来财务风险，您确定要保存吗？
            if (!data.invoiceCode || !data.invoiceNo) {
                msg1.push(`${msg1.length + 1}、${this.$t('tips.invoiceTips')}`);
            }
            if (msg1 && msg1.length) {
                msg1.push(`${this.$t('tips.areYouSureToSave')}`);
                this.$confirm(`${msg1.join('</br>')}`, this.$t('tips.tips'), {
                    confirmButtonText: this.$t('button.determine'),
                    cancelButtonText: this.$t('button.close'),
                    dangerouslyUseHTMLString: true,
                    type: 'warning'
                }).then(() => {
                    this.handleSaveData(data, isProcess);
                });
            } else {
                this.handleSaveData(data, isProcess);
            }
        }
    }
};
</script>
<style lang="scss" scoped>
  .calculationTule {
    display: inline-block;
    margin-right: 10px;
  }
</style>
