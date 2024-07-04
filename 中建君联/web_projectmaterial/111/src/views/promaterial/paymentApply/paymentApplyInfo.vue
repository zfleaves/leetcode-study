<!--
 * @Author: your name
 * @Date: 2020-07-30 10:43:28
 * @LastEditTime: 2022-12-02 15:47:25
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: src\views\promaterial\paymentApply\paymentApplyInfo.vue
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
                    :customRules="customRules"
                    @editFormEvent="editFormEvent">
                    <template slot="form-contractName" slot-scope="{scope, item}">
                        <el-form-item :label="$t(item.label)" :prop="item.prop"
                          :class="item.label.length > 7 && 'maxLabel'" :title="$t(item.label)">
                            <div class="slot-input">
                                <el-input
                                    v-model.trim="scope[item.prop]"
                                    :size="item.size || 'small'"
                                    readonly>
                                    <template slot="suffix" v-if="item.inputStatus !== 'disable' && pageDisabled">
                                        <i v-if="scope[item.prop]" class="slot-close el-icon-circle-close" @click="handleClearExpendContract(scope, item)"></i>
                                        <i class="multiple-choice-icon iconfont icon-menu" @click="handleSelectExpendContract(scope, item)"></i>
                                    </template>
                                </el-input>
                            </div>
                        </el-form-item>
                    </template>
                </g-edit-form>
                <!-- 明细清单 -->
                <div v-if="pageConfigLoading">
                    <div v-for="subTable in pageConfig.subTableConfig" :key="subTable.subTableName">
                        <g-edit-title :title="$t(`paymentApply.${subTable.subTableName}`)">
                            <g-button :operationButtons="subTable.subTableButton" @editTableBut="mainOperateBtnSubTable"
                            :paymentAccountDescription="subTable.subTableName === 'purchasePaymentApplyDetail' ? true : false">
                            </g-button>
                        </g-edit-title>
                        <g-edit-pl-table
                            :ref="subTable.subTableName"
                            :type="type"
                            :isSelection="subTable.isSelection"
                            :tableConfig="subTable.tableList"
                            :subTable='subTable'
                            :customRules="customRulesTable"
                            :delete.sync="deleteList[subTable.subTableName]"
                            @editTableEvent='editTableEvent'>
                        </g-edit-pl-table>
                    </div>
                </div>
            </div>
        </edit-page>
        <!-- 选择合同 -->
        <g-dialog v-if="dialogExpendContract" :dialogConfig="dialogConfigExpendContract" :isVisible.sync="dialogExpendContract">
            <expendRegister slot="body" slot-scope="{height}" :dialogHeight="height"
                :close.sync="dialogExpendContract"
                type='paymentApply'
                :selectId="pageConfig.projectForm.contractId || 0"
                :projectId="pageConfig.projectForm.projectId"
                @getData="getExpendContractData" v-if="dialogExpendContract">
            </expendRegister>
        </g-dialog>
    </div>
</template>
<script>
import Page from './configEdit.js';
import {editPage} from 'mixins/editMixins';

export default {
    name: 'paymentApplyEdit',
    mixins: [editPage],
    data () {
        const bankAccountNoValid = (rule, value, callback) => {
            if (value) {
                const regular = /[0-9]*/;
                if (!regular.test(value)) {
                    callback(new Error(this.$t('paymentApply.pleaseEnterANumber')));
                } else {
                    callback();
                }
            } else {
                callback();
            }
        };
        const paymentCardNoValid = (rule, value, callback) => {
            if (value) {
                const regular = /[0-9]*/;
                if (!regular.test(value)) {
                    callback(new Error(this.$t('paymentApply.pleaseEnterANumber')));
                } else {
                    callback();
                }
            } else {
                callback(new Error(this.$t('paymentApply.paymentCardNoTips')));
            }
        };
        return {
            page: new Page(),
            projectForm: {
                contractCode: '',
                applyDate: '',
                applyUserId: 0,
                applyUserName: '',
                attachment: '',
                reimburseAmount: 0,
                projectId: 0,
                purchaseContent: '',
                sporadicPurchaseReason: '',
                totalInvoiceAmount: '',
                totalPaymentAmount: '',
                totalSettlementAmount: '',
                contractAmount: '',
                actualPaymentAmount: 0,
                costControlRuleValue: '',
                costControlRuleCode: '',
                orgId: this.$utils.Auth.hasUserInfo().orgId,
                parentSubOrgId: this.$utils.Auth.hasUserInfo().parentSubOrgId,
                createTime: this.$utils.commonUtil.formatTime(new Date()),
                createByName: this.$utils.Auth.hasUserInfo().userName
            },
            // 选择零星采购
            dialogVisible: false,
            dialogConfig: {
                title: this.$t('paymentApply.seleSporadicPurchase'),
                appendBody: false,
                center: true,
                top: '50px',
                width: '80%',
                span: '0.75'
            },
            varietiesIdList: [],
            customRules: {
                bankAccountNo: [{ validator: bankAccountNoValid, trigger: 'blur' }]
            },
            customRulesTable: {
                // paymentCardNo: [{ required: true, validator: paymentCardNoValid, trigger: 'blur' }]
            },
            // 选择关联合同
            dialogExpendContract: false,
            dialogConfigExpendContract: {
                title: this.$t('paymentApply.seleExpendContract'),
                appendBody: false,
                center: true,
                top: '50px',
                width: '80%',
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
    components: {
        expendRegister(resolve) {
            require(['../compoent/expendRegister/expendRegister'], resolve);
        }
    },
    methods: {
        // 获取info数据
        async _getInfoData(id = 0) {
            await this.handleGetInfoData(id, this.page.PageConfig.processParmas.infoUrl);
        },
        // 清除关联合同
        handleClearExpendContract(row, item) {
            const params = {
                paramsConfig: item,
                selectList: []
            };
            this.handleSelect(params, 'contractName');
        },
        // 打开关联合同弹窗
        handleSelectExpendContract(row, item) {
            if (!this.pageConfig.projectForm.projectName) {
                this.$message.error(this.$t('tips.pleaseSelectProject'));
                return;
            }
            this.contractConfig = item;
            this.dialogExpendContract = true;
        },
        // 选中的关联合同数据
        getExpendContractData(arr) {
            const params = {
                paramsConfig: this.contractConfig,
                selectList: arr
            };
            this.handleSelect(params, 'contractName');
            this.dialogExpendContract = false;
        },
        // 添加明细
        sysHandleDeletaAdd(tableName) {
            if (!this.pageConfig.projectForm.projectName) {
                this.$message.error(this.$t('tips.pleaseSelectProject'));
                return;
            }
            // if (!this.pageConfig.projectForm.contractName) {
            //     this.$message.error(this.$t('paymentApply.pleaseSelectContract'));
            //     return;
            // }
            const tableDataRow = this.$clone(this.pageConfig.subTableConfig[tableName].tableList.tableDataRow);
            this.pageConfig.subTableConfig[tableName].tableData.push(tableDataRow);
        },
        // 计算
        handleCalculation({item, row, event, subTable, rowIndex}) {
            this.deletTableCallback(subTable.subTableName);
        },
        // 金额计算
        deletTableCallback(tableName) {
            const tableData = this.pageConfig.subTableConfig[tableName].tableData;
            let applyPaymentAmount = 0; // 金额(不含税);
            for (const item of tableData) {
                applyPaymentAmount += Number(item.paymentAmount || 0);
            }
            // this.$set(this.pageConfig.projectForm, 'applyPaymentAmount', applyPaymentAmount.toFixed(2));
            this.$set(this.pageConfig.projectForm, 'actualPaymentAmount', Number(applyPaymentAmount.toFixed(2)));
        },
        // 保存
        handleSave (isProcess = false) {
            this.$refs.editForm.getValidateForm(async () => {
                const data = this.$clone(this.pageConfig.projectForm);
                const purchasePaymentApplyDetail = this.$refs.purchasePaymentApplyDetail[0].validateTableData();
                if (!purchasePaymentApplyDetail) {
                    // 存在未填写或个数错误的数据
                    this.$message.error(`${this.$t('paymentApply.purchasePaymentApplyDetail')}${this.$t('tips.notFilledIn')}`);
                    return;
                }
                this.checkAmount(data, purchasePaymentApplyDetail, isProcess);
            });
        },
        setPaymentControlRatio(data, purchasePaymentApplyDetail, isProcess) {
            const totalPaymentAmount = Number(data.totalPaymentAmount) || 0; // 累计已支付
            const contractAmount = Number(data.contractAmount) || 0; // 合同签订金额
            const applyPaymentAmount = Number(data.applyPaymentAmount) || 0; // 本次申请支付
            if ((totalPaymentAmount + applyPaymentAmount) > contractAmount) {
                // 截至当前支付申请，累计支付金额为：{keyValue}元,
                // 已经超过合同签订金额：{keyValue}元，确定要继续下达吗？
                const msg1 = this.$t('paymentApply.saveTips1').replace('{keyValue}', Number((totalPaymentAmount + applyPaymentAmount).toFixed(2)));
                const msg2 = this.$t('paymentApply.saveTips2').replace('{keyValue}', Number(contractAmount).toFixed(2));
                this.$confirm(`${msg1} ${msg2}`, this.$t('tips.tips'), {
                    confirmButtonText: this.$t('button.determine'),
                    cancelButtonText: this.$t('button.close'),
                    dangerouslyUseHTMLString: true,
                    type: 'warning'
                }).then(() => {
                    this.beforeSave(data, purchasePaymentApplyDetail, isProcess);
                }).catch(() => {

                });
            } else {
                this.beforeSave(data, purchasePaymentApplyDetail, isProcess);
            }
        },
        beforeSave(data, purchasePaymentApplyDetail, isProcess) {
            // 金额合计
            const actualPaymentAmount = purchasePaymentApplyDetail.reduce((a, b, c) => {
                return a += Number(b.paymentAmount);
            }, 0);
            data.actualPaymentAmount = Number(actualPaymentAmount.toFixed(2)) || 0;
            data.paymentApplyDetails = purchasePaymentApplyDetail;
            this.beforeAmountSave(data, isProcess);
            // this.handleSaveData(data, isProcess);
        },
        // 校验申请金额和实际付款金额
        beforeAmountSave(data, isProcess) {
            const { applyPaymentAmount, actualPaymentAmount } = data;
            if (!actualPaymentAmount) {
                this.handleSaveData(data, isProcess);
                return;
            }
            if (Number(applyPaymentAmount.toFixed(2)) === Number(actualPaymentAmount.toFixed(2))) {
                this.handleSaveData(data, isProcess);
                return;
            }
            // 实际支付金额与申请付款金额不一致，确定要继续保存吗？
            const msg1 = this.$t('paymentApply.saveAmountTips1');
            this.$confirm(msg1, this.$t('tips.tips'), {
                confirmButtonText: this.$t('button.determine'),
                cancelButtonText: this.$t('button.close'),
                dangerouslyUseHTMLString: true,
                type: 'warning'
            }).then(() => {
                this.handleSaveData(data, isProcess);
            });
        },
        // 金额校验
        async checkAmount(data, purchasePaymentApplyDetail, isProcess) {
            const tips = [];
            const res = await this.$store.dispatch('paymentApply/getContractInfo', {expendRegisterId: data.contractId});
            const paymentControlRatio = Number(res.results.paymentControlRatio) || 0;
            const totalPaymentAmount = Number(data.totalPaymentAmount) || 0; // 累计已支付
            const totalSettlementAmount = Number(data.totalSettlementAmount) || 0; // 累计已结算
            const applyPaymentAmount = Number(data.applyPaymentAmount) || 0; // 本次申请支付
            const totalInvoiceAmount = Number(data.totalInvoiceAmount) || 0; // 累计已收票
            const contractAmount = Number(data.contractAmount) || 0; // 合同签订金额
            // 实际支付
            const actualPaymentAmount = purchasePaymentApplyDetail.reduce((a, b, c) => {
                return a += Number(b.paymentAmount);
            }, 0);
            data.actualPaymentAmount = Number(actualPaymentAmount.toFixed(2)) || 0;
            data.paymentApplyDetails = purchasePaymentApplyDetail;
            // 1
            if (res.results.paymentControlRatio === null || res.results.paymentControlRatio === '') {
                if ((totalPaymentAmount + applyPaymentAmount) > contractAmount) {
                    // 截至当前支付申请，累计支付金额为：{keyValue}元,
                    // 已经超过合同签订金额：{keyValue}元，确定要继续下达吗？
                    const msg1 = this.$t('paymentApply.saveTips1').replace('{keyValue}', Number((totalPaymentAmount + applyPaymentAmount).toFixed(2)));
                    const msg2 = this.$t('paymentApply.saveTips2').replace('{keyValue}', Number(contractAmount).toFixed(2));
                    tips.push(`${tips.length + 1}：${msg1} ${msg2}`);
                }
            }

            // 2

            if (actualPaymentAmount && Number(applyPaymentAmount.toFixed(2)) !== Number(actualPaymentAmount.toFixed(2))) {
                // 实际支付金额与申请付款金额不一致，确定要继续保存吗？
                tips.push(`${tips.length + 1}：${this.$t('paymentApply.saveAmountTips1')}`);
            }

            // 3
            const paymentAmount = totalPaymentAmount + applyPaymentAmount; // 支付金额
            if (res.results.paymentControlRatio && (totalSettlementAmount * (paymentControlRatio / 100) < paymentAmount)) {
                // 您的已结算额：{keyValue},
                // 已付款额：{keyValue},
                // 本次申请后会超过合同设置的付款控制比{keyValue}%，您确定要发起此付款申请吗？
                const msg1 = this.$t('fConfig.savePayTips1').replace('{keyValue}', Number((totalSettlementAmount).toFixed(2)));
                const msg2 = this.$t('fConfig.savePayTips2').replace('{keyValue}', Number((paymentAmount).toFixed(2)));
                const msg3 = this.$t('fConfig.savePayTips3').replace('{keyValue}', Number(paymentControlRatio).toFixed(2));
                tips.push(`${tips.length + 1}：${msg1} ${msg2} ${msg3}`);
            }
            // 付款申请时，如果申请的付款类型不是质保金，且申请付款的金额+已付款的金额  大于 结算总金额（1-质保金比例） 时，
            // 二次确认提示：本合同需要预留一定百分比的质保金，而您本次申请付款金额支付后，剩余应付低于设置的质保金额度。您确定要申请付款吗？
            // 4
            const amount = Number((totalSettlementAmount * (1 - res.results.qualityDepositScale)).toFixed(2));
            if (data.paymentCode !== '03' && (Number((applyPaymentAmount + totalPaymentAmount).toFixed(2)) > amount)) {
                tips.push(`${tips.length + 1}：${this.$t('fConfig.checkQualityDepositScaleTips')}`);
            }
            // 5
            // 如果选择的付款类型 不是 预付款，且本次付款金额+已付款金额大于已收票金额，
            // 提示：本次支付后，将超过收票金额，请您知悉。如果未收票，不允许付款，请您不要提交，避免造成财务缺票风险！
            if (data.paymentCode !== '01' && (Number((applyPaymentAmount + totalPaymentAmount).toFixed(2)) > totalInvoiceAmount)) {
                tips.push(`${tips.length + 1}：${this.$t('tips.checkPaymentTotalInvoiceTips')}`);
            }
            // 6
            // 累计付款金额（实际付款金额之和） +本单据的本次申请支付字段与目标成本分解主表的成控材料费对比
            // 您的材料顾客申请的累计付款超过成控额{keyValue}，确定要保存吗？
            this.getPaymentTotalamountContrast(data, tips, (msgTips) => {
                if (msgTips.length > 0) {
                    this.$confirm(msgTips.join('</br>'), this.$t('tips.tips'), {
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
            });
        },
        async getPaymentTotalamountContrast(data, tips, callback) {
            if (data.costControlRuleCode && data.costControlRuleCode === '03') {
                callback && callback(tips);
                return;
            }
            // 累计结算金额
            const paymentTotalamount = await this.$store.dispatch('paymentApply/getPaymentTotalamount', {projectId: this.pageConfig.projectForm.projectId}).then(res => res.results);
            // 目标成本分解主表的成控材料费
            const accountInfo = await this.$store.dispatch('purchaseSettlement/getProcostAccountInfo', {projectIds: [this.pageConfig.projectForm.projectId]}).then(res => res.results);
            const materialCostAmount = (accountInfo.materialCostAmount || 0);
            // 累计付款金额（实际付款金额之和） +本单据的本次申请支付字段与目标成本分解主表的成控材料费对比
            const applyPaymentAmount = Number(data.applyPaymentAmount || 0);
            if (((paymentTotalamount || 0) + applyPaymentAmount) > materialCostAmount) {
                const goBeyondAmount = Number((((paymentTotalamount || 0) + applyPaymentAmount) - materialCostAmount).toFixed(2));
                // 您的材料成控额为{keyValueCost}，采购合同的累计付款额已超出成控额{keyValue}，确定要保存吗？
                const msgCost = this.$t('paymentApply.paymentApplyTotalamountContrastTips2').replace('{keyValueCost}', materialCostAmount);
                const msg = msgCost.replace('{keyValue}', goBeyondAmount);
                tips.push(`${tips.length + 1}：${msg}`);
                callback && callback(tips);
            } else {
                callback && callback(tips);
            }
        }
    }
};
</script>
