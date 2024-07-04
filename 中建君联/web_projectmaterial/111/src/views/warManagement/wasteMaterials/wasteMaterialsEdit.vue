
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
                        <g-edit-title :title="$t(`wasteMaterials.${subTable.subTableName}`)"
                            :titleTips="subTable.subTableName === 'warWasteMaterialsDetail' ? $t(`wasteMaterials.${subTable.titleTips}`) : ''">
                            <g-button :operationButtons="subTable.subTableButton" @editTableBut="mainOperateBtnSubTable"
                                :isCollection="true"
                                :paymentAccountDescription="subTable.subTableName === 'warWasteMaterialsPayment' ? true : false">
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
                        </g-edit-pl-table>
                    </div>
                </div>
            </div>
        </edit-page>
        <!-- 选择库存明细 -->
        <g-dialog v-if="dialogVisible" :dialogConfig="dialogConfig" :isVisible.sync="dialogVisible">
            <stockMaterials slot="body" slot-scope="{height}" :dialogHeight="height"
                :close.sync="dialogVisible"
                :selectList="selectList"
                :projectId="pageConfig.projectForm.projectId"
                varietiesTitle="wasteMaterials.selectVarieties"
                @getData="getPurchaseApplyData">
            </stockMaterials>
        </g-dialog>
    </div>
</template>
<script>
import Page from './configEdit.js';
import {editPage} from 'mixins/editMixins';

export default {
    name: 'wasteMaterialsEdit',
    mixins: [editPage],
    data () {
        const quantityValid = (rule, value, callback) => {
            if (!value) {
                callback(new Error(`${this.$t('tips.pleaseEnter')}${this.$t('wasteMaterials.handleQuantity')}`));
            } else {
                callback();
            }
        };
        return {
            page: new Page(),
            projectForm: {
                afterAttachment: '',
                attachment: '',
                beforeAttachment: '',
                buyUnitName: '',
                details: [],
                handleDate: '',
                handleDutyUserId: '',
                handleDutyUserName: '',
                handleMethodCode: '',
                handleMethodValue: '',
                handleReason: '',
                meterageMethodCode: '',
                meterageMethodValue: '',
                payments: [],
                projectId: '',
                remarks: '',
                totalAfterEstimateAmount: '',
                totalCollectionAmount: '',
                totalFinalHandleAmount: '',
                wasteMaterialsName: '',
                orgId: this.$utils.Auth.hasUserInfo().orgId,
                parentSubOrgId: this.$utils.Auth.hasUserInfo().parentSubOrgId,
                createTime: this.$utils.commonUtil.formatTime(new Date()),
                createByName: this.$utils.Auth.hasUserInfo().userName
            },
            // 请选择库存明细
            dialogVisible: false,
            dialogConfig: {
                title: this.$t('wasteMaterials.pleaseSelectDetails'),
                appendBody: false,
                center: true,
                top: '50px',
                width: '80%',
                span: '0.75'
            },
            selectList: [],
            subTableCustomRules: {
                handleQuantity: [{required: true, validator: quantityValid, trigger: 'blur' }]
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
        stockMaterials(resolve) {
            require(['components/material/stockMaterials/stockMaterials.vue'], resolve);
        }
    },
    methods: {
        // 获取info数据
        async _getInfoData(id = 0) {
            await this.handleGetInfoData(id, this.page.PageConfig.processParmas.infoUrl);
        },
        // 添加明细
        sysHandleDeletaAdd (tableName) {
            if (this.tableRow) {
                this.pageConfig.subTableConfig[tableName].tableData.push(this.$clone(this.tableRow));
                return ;
            }
            const tableDataRow = this.$clone(this.pageConfig.subTableConfig[tableName].tableList.tableDataRow);
            if (tableName === 'warWasteMaterialsPayment') {
                tableDataRow.agentUserName = this.$utils.Auth.hasUserInfo().userName;
            }
            this.pageConfig.subTableConfig[tableName].tableData.push(tableDataRow);
        },
        // 选择明细
        sysHandleSelectDetail(tableName) {
            if (!this.pageConfig.projectForm.projectName) {
                this.$message.error(this.$t('tips.pleaseSelectProject'));
                return;
            }
            const tableData = this.$clone(this.pageConfig.subTableConfig['warWasteMaterialsDetail'].tableData);
            const choiceTableData = tableData.filter(v => v.hashColumn);
            this.selectList = choiceTableData;
            this.dialogVisible = true;
        },
        // 获取选中的数据
        getPurchaseApplyData(arr) {
            const data = [];
            for (const item of arr) {
                data.push(
                    {
                        createTime: this.$utils.commonUtil.formatTime(new Date()),
                        afterEstimateAmount: '',
                        afterEstimateUnitPrice: '',
                        brand: item.brand,
                        currencyCode: item.currencyCode,
                        currencyValue: item.currencyValue,
                        estimateHandleAmount: '',
                        estimateHandleUnitPrice: '',
                        finalHandleAmount: '',
                        finalHandleUnitPrice: '',
                        handleQuantity: '',
                        hashColumn: item.hashColumn,
                        materialId: item.materialId,
                        materialName: item.materialName,
                        models: item.models,
                        originPurchaseAmount: '',
                        originPurchaseUnitPrice: '',
                        remarks: '',
                        standards: item.standards,
                        stock: item.availableStock,
                        taxRate: item.taxRate,
                        unit: item.unit,
                        unitPrice: item.unitPrice,
                        warehouseId: item.warehouseId,
                        warehouseShelvesId: item.warehouseShelvesId,
                        warehouseShelvesName: item.warehouseShelvesName,
                        warrantyExpiredDate: item.warrantyExpiredDate
                    }
                );
            }
            this.setSubTable('warWasteMaterialsDetail', data);
        },
        setSubTable(tableName, arr) {
            const tableData = this.$clone(this.pageConfig.subTableConfig[tableName].tableData);
            const choiceTableData = tableData.filter(v => v.hashColumn);
            const addTableData = tableData.filter(v => !v.hashColumn);
            const selectTableList = [];
            const newSelectTableList = [];
            if (!choiceTableData.length || !arr.length) {
                this.$set(this.pageConfig.subTableConfig[tableName], 'tableData', arr.concat(addTableData));
            }
            if (choiceTableData.length) {
                for (const item of choiceTableData) {
                    for (const val of arr) {
                        if (item.hashColumn === val.hashColumn) {
                            selectTableList.push(item);
                        }
                    }
                }
                for (const item of arr) {
                    const index = choiceTableData.findIndex(v => v.hashColumn === item.hashColumn);
                    if (index < 0) {
                        newSelectTableList.push(item);
                    }
                }
                this.$set(this.pageConfig.subTableConfig[tableName], 'tableData', selectTableList.concat(newSelectTableList, addTableData));
            }
            this.setMainCheckMaterials(tableName);
            this.dialogVisible = false;
        },
        // 计算
        handleCalculation({item, row, event, subTable, rowIndex}) {
            if (subTable.subTableName === 'warWasteMaterialsPayment') {
                this.setAmount(subTable.subTableName);
            } else {
                if (item.prop === 'finalHandleAmount') {
                    this.setAmount(subTable.subTableName);
                } else {
                    this.handleCalculation1({ item, row, event, subTable, rowIndex });
                }
            }
        },
        handleCalculation1({ item, row, event, subTable, rowIndex }) {
            const handleQuantity = Number(row.handleQuantity) || 0; // 数量
            const originPurchaseUnitPrice = Number(row.originPurchaseUnitPrice) || 0; // 原采购单价
            const estimateHandleUnitPrice = Number(row.estimateHandleUnitPrice) || 0; // 预计处置单价
            const afterEstimateUnitPrice = Number(row.afterEstimateUnitPrice) || 0; // 估算后单价
            const finalHandleUnitPrice = Number(row.finalHandleUnitPrice) || 0; // 最终处置单价

            const originPurchaseAmount = handleQuantity * originPurchaseUnitPrice; // 金原采购金额
            const estimateHandleAmount = handleQuantity * estimateHandleUnitPrice; // 预计处置金额
            const afterEstimateAmount = handleQuantity * afterEstimateUnitPrice; // 估算后金额
            const finalHandleAmount = handleQuantity * finalHandleUnitPrice; // 最终处置金额
            this.$set(row, 'originPurchaseAmount', Number((originPurchaseAmount || 0).toFixed(2)));
            this.$set(row, 'estimateHandleAmount', Number((estimateHandleAmount || 0).toFixed(2)));
            this.$set(row, 'afterEstimateAmount', Number((afterEstimateAmount || 0).toFixed(2)));
            this.$set(row, 'finalHandleAmount', Number((finalHandleAmount || 0).toFixed(2)));

            this.setAmount(subTable.subTableName);
        },
        // 批量删除后计算
        deletTableCallback(tableName) {
            this.setAmount(tableName);
            this.setMainCheckMaterials(tableName);
        },
        // 计算金额
        setAmount (tableName) {
            if (tableName === 'warWasteMaterialsPayment') {
                const data = this.$clone(this.pageConfig.subTableConfig[tableName].tableData);
                const totalCollectionAmount = data.reduce((a, b, c) => {
                    return a += Number(b.paymentAmount || 0);
                }, 0);
                this.$set(this.pageConfig.projectForm, 'totalCollectionAmount', Number(totalCollectionAmount.toFixed(2)));
            } else {
                const data = this.$clone(this.pageConfig.subTableConfig[tableName].tableData);
                // 估算后金额
                const totalAfterEstimateAmount = data.reduce((a, b, c) => {
                    return a += Number(b.afterEstimateAmount || 0);
                }, 0);
                this.$set(this.pageConfig.projectForm, 'totalAfterEstimateAmount', Number(totalAfterEstimateAmount.toFixed(2)));
                // 最终处置金额
                const totalFinalHandleAmount = data.reduce((a, b, c) => {
                    return a += Number(b.finalHandleAmount || 0);
                }, 0);
                this.$set(this.pageConfig.projectForm, 'totalFinalHandleAmount', Number(totalFinalHandleAmount.toFixed(2)));
            }
        },
        // 获取废旧物资名称
        setMainCheckMaterials(tableName) {
            const wasteMaterialsName = this.pageConfig.subTableConfig[tableName].tableData.slice(-5).map(v => v.materialName).join(',');
            this.$set(this.pageConfig.projectForm, 'wasteMaterialsName', wasteMaterialsName);
        },
        // 保存
        handleSave (isProcess = false) {
            this.setMainCheckMaterials('warWasteMaterialsDetail');
            this.$refs.editForm.getValidateForm(() => {
                const data = this.$clone(this.pageConfig.projectForm);
                if (!data.totalCollectionAmount) {
                    data.totalCollectionAmount = 0;
                }
                const warWasteMaterialsDetail = this.$refs.warWasteMaterialsDetail[0].validateTableData();
                if (!warWasteMaterialsDetail || warWasteMaterialsDetail.length === 0) {
                    // 存在未填写或个数错误的数据
                    this.$message.error(`${this.$t('wasteMaterials.warWasteMaterialsDetail')}${this.$t('tips.notFilledIn')}`);
                    return;
                }
                // 支付明细
                const warWasteMaterialsPayment = this.$refs.warWasteMaterialsPayment[0].validateTableData();
                if (!warWasteMaterialsPayment) {
                    // 存在未填写或个数错误的数据
                    this.$message.error(`${this.$t('wasteMaterials.warWasteMaterialsPayment')}${this.$t('tips.notFilledIn')}`);
                    return;
                }
                data.details = warWasteMaterialsDetail;
                data.payments = warWasteMaterialsPayment;
                this.handleSaveData(data, isProcess);
            });
        },
        // 导出明细
        sysHandleExport (tableName) {
            if (this.pageConfig.subTableConfig[tableName].tableData.length === 0) return;
            if (this.pageDisabled) {
                // 查看时可导出
                this.$message.error(`${this.$t('menu.wasteMaterials')}${this.$t('tips.exportDetailTips')}${this.$t('wasteMaterials.warWasteMaterialsDetail')}`);
                return;
            }
            const data = {
                warWasteMaterialsId: this.id
            };
            this.$store.dispatch('wasteMaterials/getExportExcel', data).then(data => {
                if (!data) return;
                const url = window.URL.createObjectURL(new Blob([data]));
                const link = document.createElement('a');
                link.style.display = 'none';
                link.href = url;
                const fileName = 'menu.wasteMaterials';
                link.setAttribute('download', `${this.$t(fileName)}${this.$t('wasteMaterials.warWasteMaterialsDetail')}${this.$t('fConfig.excel')}.xls`);
                document.body.appendChild(link);
                link.click();
            });
        }
    }
};
</script>

